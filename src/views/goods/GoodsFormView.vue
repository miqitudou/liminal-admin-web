<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Delete, Plus } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";

import ImageUploadField from "@/components/common/ImageUploadField.vue";
import { fetchCategories } from "@/api/modules/categories";
import { createGoods, fetchGoodsDetail, updateGoods } from "@/api/modules/goods";
import type { CategoryItem, GoodsItem, GoodsSpecItem } from "@/types/admin";
import { yuanToCents } from "@/utils/price";

type GoodsSpecFormItem = GoodsSpecItem & {
  price_input: string;
};

type GoodsFormState = Omit<GoodsItem, "specs"> & {
  specs: GoodsSpecFormItem[];
};

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => Boolean(route.params.goods_id));
const loading = ref(false);
const categories = ref<CategoryItem[]>([]);
const basePriceInput = ref("");

const form = reactive<GoodsFormState>({
  goods_id: "",
  category_id: "",
  category_name: "",
  goods_name: "",
  goods_desc: "",
  feature_text: "",
  cover_text: "",
  cover_color: "#f3e1cf",
  cover_image: "",
  price_cents: 0,
  price_min_cents: 0,
  price_max_cents: 0,
  sales_count: 0,
  status: "on",
  is_recommend: false,
  sort: 0,
  tags: [],
  detail_tips: [],
  specs: [],
  booking_rule: {
    min_advance_hours: 0,
    pickup_slots: [],
  },
});

const tagsText = ref("");
const detailTipsText = ref("");
const pickupSlotsText = ref("");

function formatPriceInputValue(cents: number): string {
  const value = Number(cents || 0) / 100;
  return value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function parsePriceInputValue(value: string | number): number | null {
  const text = String(value ?? "").trim();

  if (!text) {
    return null;
  }

  if (!/^\d+(\.\d{0,2})?$/.test(text)) {
    return null;
  }

  return yuanToCents(text);
}

function ensurePositivePrice(value: string | number, label: string): number {
  const cents = parsePriceInputValue(value);

  if (cents === null) {
    throw new Error(`${label}必须是数字，且最多保留两位小数`);
  }

  if (cents <= 0) {
    throw new Error(`${label}必须大于 0`);
  }

  return cents;
}

function createEmptySpec(): GoodsSpecFormItem {
  const defaultPriceText = basePriceInput.value.trim();

  return {
    spec_name: "",
    price_cents: parsePriceInputValue(defaultPriceText) || 0,
    price_input: defaultPriceText,
    stock: 0,
    min_advance_hours: 0,
    sort: form.specs.length + 1,
    status: "enabled",
  };
}

function normalizeSpec(spec: GoodsSpecItem): GoodsSpecFormItem {
  return {
    ...spec,
    price_input: formatPriceInputValue(spec.price_cents),
  };
}

function syncTextareasFromForm() {
  tagsText.value = form.tags.join("\n");
  detailTipsText.value = form.detail_tips.join("\n");
  pickupSlotsText.value = form.booking_rule.pickup_slots.join("\n");
}

function syncFormFromTextareas() {
  form.tags = tagsText.value.split("\n").map((item) => item.trim()).filter(Boolean);
  form.detail_tips = detailTipsText.value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  form.booking_rule.pickup_slots = pickupSlotsText.value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function applyGoodsDetail(data: GoodsItem) {
  form.goods_id = data.goods_id || "";
  form.category_id = data.category_id;
  form.category_name = data.category_name || "";
  form.goods_name = data.goods_name;
  form.goods_desc = data.goods_desc;
  form.feature_text = data.feature_text || "";
  form.cover_text = data.cover_text;
  form.cover_color = data.cover_color;
  form.cover_image = data.cover_image;
  form.price_cents = data.price_cents;
  form.price_min_cents = data.price_min_cents || data.price_cents;
  form.price_max_cents = data.price_max_cents || data.price_cents;
  form.sales_count = data.sales_count;
  form.status = data.status;
  form.is_recommend = data.is_recommend;
  form.sort = data.sort;
  form.tags = [...data.tags];
  form.detail_tips = [...data.detail_tips];
  form.booking_rule = {
    min_advance_hours: data.booking_rule.min_advance_hours,
    pickup_slots: [...data.booking_rule.pickup_slots],
  };
  form.specs = (data.specs || []).map(normalizeSpec);
  basePriceInput.value = formatPriceInputValue(data.price_cents);
  syncTextareasFromForm();
}

function buildPayload() {
  const basePriceCents = ensurePositivePrice(basePriceInput.value, "默认价格");

  return {
    category_id: form.category_id,
    goods_name: form.goods_name,
    goods_desc: form.goods_desc,
    feature_text: form.feature_text,
    cover_text: form.cover_text,
    cover_color: form.cover_color,
    cover_image: form.cover_image,
    price_cents: basePriceCents,
    sales_count: form.sales_count,
    status: form.status,
    is_recommend: form.is_recommend,
    sort: form.sort,
    tags: form.tags,
    detail_tips: form.detail_tips,
    specs: form.specs.map((spec, index) => {
      const priceCents = ensurePositivePrice(spec.price_input, `规格 ${index + 1} 的价格`);

      return {
        spec_id: spec.spec_id,
        spec_name: spec.spec_name,
        price_cents: priceCents,
        stock: spec.stock,
        min_advance_hours: spec.min_advance_hours,
        sort: spec.sort,
        status: spec.status,
      };
    }),
    booking_rule: {
      min_advance_hours: form.booking_rule.min_advance_hours,
      pickup_slots: form.booking_rule.pickup_slots,
    },
  };
}

async function loadCategories() {
  const data = await fetchCategories({
    page: 1,
    page_size: 100,
  });
  categories.value = data.list;
  if (!form.category_id && data.list.length) {
    form.category_id = data.list[0].category_id;
  }
}

async function loadDetail() {
  if (!isEdit.value) {
    basePriceInput.value = formatPriceInputValue(form.price_cents);
    if (!form.specs.length) {
      form.specs.push(createEmptySpec());
    }
    syncTextareasFromForm();
    return;
  }

  loading.value = true;
  try {
    const data = await fetchGoodsDetail(String(route.params.goods_id));
    applyGoodsDetail(data);
  } finally {
    loading.value = false;
  }
}

function addSpec() {
  form.specs.push(createEmptySpec());
}

function removeSpec(index: number) {
  form.specs.splice(index, 1);
  form.specs.forEach((spec, specIndex) => {
    spec.sort = specIndex + 1;
  });
}

async function handleSubmit() {
  syncFormFromTextareas();

  let payload;
  try {
    payload = buildPayload();
  } catch (error) {
    ElMessage.warning(error instanceof Error ? error.message : "请检查价格配置");
    return;
  }

  loading.value = true;
  try {
    if (isEdit.value) {
      await updateGoods(String(route.params.goods_id), payload);
      ElMessage.success("商品已更新");
    } else {
      await createGoods(payload);
      ElMessage.success("商品已创建");
    }
    router.push("/goods");
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadCategories();
  await loadDetail();
});
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <h2 class="page-title">{{ isEdit ? "编辑商品" : "新建商品" }}</h2>
        <div class="page-subtitle">
          这里维护商品基础信息、默认价格、规格价格、库存与预约规则。
        </div>
      </div>
    </div>

    <div class="page-card form-card" v-loading="loading">
      <el-form label-position="top">
        <div class="form-grid">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" />
          </el-form-item>
          <el-form-item label="所属分类">
            <el-select v-model="form.category_id">
              <el-option
                v-for="item in categories"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="封面文案">
            <el-input v-model="form.cover_text" />
          </el-form-item>
          <el-form-item label="特色标签">
            <el-input v-model="form.feature_text" placeholder="例如：本店回头客第 1 名" />
          </el-form-item>
          <el-form-item label="封面底色">
            <el-input v-model="form.cover_color" />
          </el-form-item>
          <el-form-item label="默认价格（元/份）">
            <el-input
              v-model="basePriceInput"
              inputmode="decimal"
              placeholder="例如 100.2"
            />
          </el-form-item>
          <el-form-item label="销量">
            <el-input-number v-model="form.sales_count" :min="0" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status">
              <el-option label="上架" value="on" />
              <el-option label="下架" value="off" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="商品描述">
          <el-input v-model="form.goods_desc" type="textarea" :rows="4" />
        </el-form-item>

        <el-form-item label="封面图片">
          <ImageUploadField v-model="form.cover_image" />
        </el-form-item>

        <div class="form-grid">
          <el-form-item label="标签（每行一个）">
            <el-input v-model="tagsText" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="详情提示（每行一个）">
            <el-input v-model="detailTipsText" type="textarea" :rows="4" />
          </el-form-item>
        </div>

        <div class="form-grid">
          <el-form-item label="最少提前小时数">
            <el-input-number v-model="form.booking_rule.min_advance_hours" :min="0" />
          </el-form-item>
          <el-form-item label="提货时段（每行一个）">
            <el-input v-model="pickupSlotsText" type="textarea" :rows="4" />
          </el-form-item>
        </div>

        <div class="spec-header">
          <div>
            <h3>商品规格</h3>
            <p>默认价格独立保存；每个规格也可以单独填写价格，支持输入 `100.2` 这类小数。</p>
          </div>
          <el-button type="primary" plain @click="addSpec">
            <el-icon><Plus /></el-icon>
            新增规格
          </el-button>
        </div>

        <div class="spec-list">
          <div v-for="(spec, index) in form.specs" :key="spec.spec_id || index" class="spec-card">
            <div class="spec-card-head">
              <div class="spec-title">规格 {{ index + 1 }}</div>
              <el-button link type="danger" @click="removeSpec(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>

            <div class="spec-grid">
              <el-form-item label="规格名称">
                <el-input v-model="spec.spec_name" />
              </el-form-item>
              <el-form-item label="规格价格（元）">
                <el-input
                  v-model="spec.price_input"
                  inputmode="decimal"
                  placeholder="例如 100.2"
                />
              </el-form-item>
              <el-form-item label="库存">
                <el-input-number v-model="spec.stock" :min="0" />
              </el-form-item>
              <el-form-item label="最少提前小时数">
                <el-input-number v-model="spec.min_advance_hours" :min="0" />
              </el-form-item>
              <el-form-item label="排序">
                <el-input-number v-model="spec.sort" :min="0" />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="spec.status">
                  <el-option label="启用" value="enabled" />
                  <el-option label="停用" value="disabled" />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="actions">
          <el-button @click="router.push('/goods')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEdit ? "保存修改" : "创建商品" }}
          </el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>

<style scoped>
.form-card {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.spec-header {
  margin-top: 10px;
  padding-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.spec-header h3 {
  margin: 0;
}

.spec-header p {
  margin: 6px 0 0;
  color: var(--text-secondary);
}

.spec-list {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.spec-card {
  padding: 18px;
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  background: #fbfcfe;
}

.spec-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.spec-title {
  font-weight: 700;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}
</style>
