const TYPE_LABELS = { lunch: "简餐", meat: "荤菜", vegetable: "素菜" };
const STORAGE_KEY = "two-person-meal-planner-v1";
const LIBRARY_VERSION = 6;

const dishGroups = [
  ["海鲜", "meat", ["三文鱼", "虾仁芦笋", "辣金枪鱼", "三文鱼牛油果", "椰浆咖喱虾", "酸辣汤", "烤虾滑", "烤鱼丸", "意大利海鲜汤", "冬阴功汤", "红烧笔管", "蒸鳕鱼", "辣奶油三文鱼"]],
  ["鸡肉&蛋", "meat", ["烤鸡排", "红烧鸡翅", "（蛋黄）烤鸡翅", "水蒸蛋", "北非蛋", "黑松露炒蛋", "奶油蘑菇汤", "鸡腿肉炒蘑菇", "番茄炒蛋", "芝士蟹柳滑蛋"]],
  ["猪肉", "meat", ["红烧排骨", "排骨汤", "瓦罐肉丸汤", "滑蛋午餐肉", "烤排骨", "红烧狮子头", "猪耳朵", "韩国泡菜汤", "韩国大酱汤"]],
  ["牛肉", "meat", ["水煮肥牛", "番茄牛腩", "汉堡肉"]],
  ["牛肉", "lunch", ["吉野家牛肉饭", "黑松露牛肉饭"]],
  ["主食", "lunch", ["辣白菜炒饭", "沙蒜豆面", "叻沙", "日式烤年糕", "意大利面", "鸭血粉丝汤", "泡菜豆腐泡面", "蛋包饭", "火锅", "松饼", "牛奶麻辣烫", "部队锅"]]
];

const recommendationPool = [
  ["蒜蓉粉丝扇贝", "meat", "海鲜"], ["香煎鲳鱼", "meat", "海鲜"], ["豉汁蒸鲈鱼", "meat", "海鲜"], ["泰式咖喱蟹", "meat", "海鲜"], ["海鲜豆腐煲", "meat", "海鲜"], ["柠檬黄油鳕鱼", "meat", "海鲜"],
  ["日式南蛮鸡", "meat", "鸡肉&蛋"], ["葱油鸡", "meat", "鸡肉&蛋"], ["咖喱鸡腿煲", "meat", "鸡肉&蛋"], ["虾仁茶碗蒸", "meat", "鸡肉&蛋"], ["菠菜鸡蛋卷", "meat", "鸡肉&蛋"], ["韩式辣鸡", "meat", "鸡肉&蛋"],
  ["梅干菜烧肉", "meat", "猪肉"], ["蒜香猪肋排", "meat", "猪肉"], ["蘑菇猪肉卷", "meat", "猪肉"], ["豆腐肉末煲", "meat", "猪肉"], ["糖醋里脊", "meat", "猪肉"],
  ["沙茶牛肉", "meat", "牛肉"], ["金针菇肥牛卷", "meat", "牛肉"], ["日式牛肉锅", "meat", "牛肉"], ["黑椒牛柳", "meat", "牛肉"], ["牛肉豆腐锅", "meat", "牛肉"],
  ["海鲜焗饭", "lunch", "主食"], ["韩式紫菜包饭", "lunch", "主食"], ["金枪鱼饭团", "lunch", "主食"], ["咖喱鸡肉乌冬", "lunch", "主食"], ["明太子意面", "lunch", "主食"],
  ["蒜蓉娃娃菜", "vegetable", "素菜"], ["清炒菜心", "vegetable", "素菜"], ["香煎豆腐", "vegetable", "素菜"], ["豆豉炒苦瓜", "vegetable", "素菜"], ["上汤西兰花", "vegetable", "素菜"]
].map(([name, type, category]) => ({ name, type, category, cookingMethod: type === "lunch" ? "预制" : "烹饪", price: 0 }));

const removedRecommendationNames = new Set(["味噌烤鳕鱼", "蒜香黄油虾", "泰式青柠蒸鱼", "韩式辣炒鱿鱼", "照烧鸡腿", "韩式炸鸡", "菠菜芝士烘蛋", "亲子丼", "韩式牛肉拌饭", "味噌猪排", "韩式烤五花肉", "菌菇肉丸汤", "寿喜烧牛肉", "黑椒牛肉粒", "蒜蓉菠菜", "蚝油生菜", "蘑菇炒西葫芦", "凉拌秋葵", "麻婆豆腐", "清炒芦笋"]);

function buildDishes(groups, prefix) {
  return groups.flatMap(([category, type, names], groupIndex) => names.map((name, index) => ({
    id: `${prefix}${groupIndex}-${index}`,
    name,
    type,
    category,
    cookingMethod: type === "lunch" ? "" : "烹饪",
    price: 0
  })));
}

const personalDishes = buildDishes(dishGroups, "u");
const vegetableDishes = [
  { id: "v1", name: "蒜蓉西兰花", type: "vegetable", category: "素菜", cookingMethod: "烹饪", price: 7.56 },
  { id: "v2", name: "清炒小青菜", type: "vegetable", category: "素菜", cookingMethod: "烹饪", price: 5.67 },
  { id: "v4", name: "香菇油菜", type: "vegetable", category: "素菜", cookingMethod: "烹饪", price: 9.92 },
  { id: "v5", name: "清炒荷兰豆", type: "vegetable", category: "素菜", cookingMethod: "烹饪", price: 11.47 }
];
const defaultDishes = [...personalDishes, ...vegetableDishes];

const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
const legacyIds = new Set(["l1", "l2", "l3", "l4", "m1", "m2", "m3", "m4", "m5", "v1", "v2", "v3", "v4", "v5"]);
const customDishes = saved?.dishes?.filter(dish => !legacyIds.has(dish.id) && !dish.id.startsWith("u") && !dish.id.startsWith("r")) || [];
const state = saved || { budget: 2500, dishes: defaultDishes, schedule: [], feedback: "", generation: 0, libraryVersion: LIBRARY_VERSION, scheduleStatus: "draft", recommendationsByWeek: {}, recommendationHistory: [] };

if ((state.libraryVersion || 0) < 2) {
  state.dishes = [...personalDishes, ...vegetableDishes, ...customDishes];
  state.schedule = [];
  state.scheduleStatus = "draft";
}
if ((state.libraryVersion || 0) < 4) {
  state.dishes = state.dishes.map(dish => ({
    ...dish,
    cookingMethod: dish.cookingMethod || "",
    price: Number.isFinite(Number(dish.price)) ? Number(dish.price) : (dish.ingredients || []).reduce((sum, item) => sum + Number(item.grams) / 500 * Number(item.price), 0)
  }));
  state.schedule = [];
  state.scheduleStatus = "draft";
}
if ((state.libraryVersion || 0) < 5) {
  state.dishes = state.dishes.map(dish => ({
    ...dish,
    cookingMethod: ["meat", "vegetable"].includes(dish.type) && !dish.cookingMethod ? "烹饪" : dish.cookingMethod
  }));
  state.schedule = [];
  state.scheduleStatus = "draft";
}
if ((state.libraryVersion || 0) < 6) {
  state.dishes = state.dishes.filter(dish => !dish.id.startsWith("r") && !removedRecommendationNames.has(dish.name));
  state.recommendationsByWeek = {};
  state.recommendationHistory = [];
  state.schedule = [];
  state.scheduleStatus = "draft";
}
state.recommendationsByWeek ||= {};
state.recommendationHistory ||= [];
state.libraryVersion = LIBRARY_VERSION;

let currentFilter = "all";
let editingDishId = null;
let adjustmentMode = false;
let replacementTarget = null;

const $ = selector => document.querySelector(selector);
const money = value => `¥${Number(value).toLocaleString("zh-CN", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const dishPrice = dish => Math.max(0, Number(dish?.price) || 0);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

function mondayOf(date = new Date()) {
  const copy = new Date(date); const day = copy.getDay() || 7;
  copy.setHours(0, 0, 0, 0); copy.setDate(copy.getDate() - day + 1); return copy;
}
function formatDate(date) { return `${date.getMonth() + 1}月${date.getDate()}日`; }
function pick(items, index) { return items.length ? items[index % items.length] : null; }
function getDish(id) { return state.dishes.find(dish => dish.id === id); }
function scheduleIsCurrent() { return state.schedule.length && mondayOf(new Date(state.schedule[0].date)).getTime() === mondayOf().getTime(); }
function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove("show"), 2200); }
function weekKey() { const monday = mondayOf(); return `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`; }
function stableScore(value) { return [...value].reduce((score, char) => (score * 31 + char.charCodeAt(0)) >>> 0, 7); }
function ensureWeeklyRecommendations() {
  const key = weekKey();
  if (!state.recommendationsByWeek[key]) {
    const libraryNames = new Set(state.dishes.map(dish => dish.name));
    const history = new Set(state.recommendationHistory);
    let candidates = recommendationPool.filter(dish => !libraryNames.has(dish.name) && !history.has(dish.name));
    if (candidates.length < 5) candidates = recommendationPool.filter(dish => !libraryNames.has(dish.name));
    const selected = candidates.sort((a, b) => stableScore(`${key}-${a.name}`) - stableScore(`${key}-${b.name}`)).slice(0, 5);
    state.recommendationsByWeek[key] = selected.map(dish => dish.name);
    state.recommendationHistory.push(...selected.map(dish => dish.name));
    save();
  }
  return state.recommendationsByWeek[key].map(name => recommendationPool.find(dish => dish.name === name)).filter(Boolean);
}

function generateSchedule() {
  const groups = {
    lunch: state.dishes.filter(dish => dish.type === "lunch"),
    meat: state.dishes.filter(dish => dish.type === "meat" && dish.cookingMethod === "烹饪"),
    vegetable: state.dishes.filter(dish => dish.type === "vegetable" && dish.cookingMethod === "烹饪")
  };
  if (!groups.lunch.length || !groups.meat.length || !groups.vegetable.length) { toast("简餐、烹饪荤菜和烹饪素菜都至少需要一道"); return; }
  const preferredLunches = groups.lunch.filter(dish => ["预制", "空气炸锅"].includes(dish.cookingMethod));
  const otherLunches = groups.lunch.filter(dish => !["预制", "空气炸锅"].includes(dish.cookingMethod));
  const preferredLunchCount = Math.min(5, preferredLunches.length);
  const monday = mondayOf();
  state.schedule = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i).toISOString(),
    lunch: pick(i < preferredLunchCount ? preferredLunches : otherLunches.length ? otherLunches : preferredLunches, i < preferredLunchCount ? i + state.generation : i - preferredLunchCount + state.generation)?.id,
    meat: pick(groups.meat, i + state.generation * 7)?.id,
    vegetable: pick(groups.vegetable, i + state.generation * 7)?.id
  }));
  state.generation += 1; state.scheduleStatus = "draft"; adjustmentMode = false; save(); renderAll();
}

function weeklyDishEntries() {
  const map = new Map();
  state.schedule.forEach(day => [day.lunch, day.meat, day.vegetable].forEach(id => {
    const dish = getDish(id); if (!dish) return;
    const row = map.get(id) || { dish, count: 0 };
    row.count += 1; map.set(id, row);
  }));
  return [...map.values()];
}

function unpricedScheduledDishes() { return weeklyDishEntries().filter(row => dishPrice(row.dish) <= 0).map(row => row.dish); }
function mealCell(dayIndex, slot) {
  const dish = getDish(state.schedule[dayIndex][slot]); const name = escapeHtml(dish?.name || "—");
  return adjustmentMode ? `<button class="meal-choice" data-replace-day="${dayIndex}" data-replace-slot="${slot}" title="替换${name}">${name} <span aria-hidden="true">✎</span></button>` : name;
}

function renderPlan() {
  const monday = mondayOf(); const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 6);
  $("#weekRange").textContent = `${formatDate(monday)} - ${formatDate(sunday)}`;
  const today = new Date().toDateString();
  $("#mealRows").innerHTML = state.schedule.map((day, dayIndex) => {
    const date = new Date(day.date); const isToday = date.toDateString() === today;
    return `<tr><td><strong>${["周日","周一","周二","周三","周四","周五","周六"][date.getDay()]}${isToday ? '<span class="today-pill">今天</span>' : ""}</strong>${formatDate(date)}</td><td>${mealCell(dayIndex, "lunch")}</td><td>${mealCell(dayIndex, "meat")}</td><td>${mealCell(dayIndex, "vegetable")}</td></tr>`;
  }).join("");
  const entries = weeklyDishEntries();
  const weekly = entries.reduce((sum, row) => sum + dishPrice(row.dish) * row.count, 0);
  const unpriced = unpricedScheduledDishes();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const monthly = weekly / 7 * daysInMonth; const ratio = monthly / state.budget;
  $("#ingredientList").innerHTML = entries.map(row => `<div class="expense-row"><strong>${escapeHtml(row.dish.name)}</strong><span>${TYPE_LABELS[row.dish.type]} · ${escapeHtml(row.dish.cookingMethod || "方法待选")}</span><span>${row.count}次</span><span class="${dishPrice(row.dish) ? "" : "unpriced"}">${dishPrice(row.dish) ? `${money(dishPrice(row.dish))}/道` : "价格待填"}</span><strong>${money(dishPrice(row.dish) * row.count)}</strong></div>`).join("");
  $("#pricingNotice").classList.toggle("show", unpriced.length > 0);
  $("#pricingNotice").textContent = unpriced.length ? `${unpriced.length} 道菜还未设置整体价格：${unpriced.map(dish => dish.name).join("、")}。请到“我的菜库”编辑价格。` : "";
  $("#ingredientCount").textContent = entries.length; $("#weeklyTotal").textContent = money(weekly);
  $("#monthlyEstimate").textContent = `${unpriced.length ? "已计价 " : "预计 "}${money(monthly)} / ${money(state.budget)}`;
  $("#budgetStatus").textContent = unpriced.length ? `有 ${unpriced.length} 道菜待定价` : ratio > 1 ? `预计超支 ${money(monthly - state.budget)}` : `预算内，还可用 ${money(state.budget - monthly)}`;
  $("#budgetBar").style.width = `${Math.min(ratio * 100, 100)}%`; $("#budgetPanel").classList.toggle("warning", ratio > 1);
  const accepted = state.scheduleStatus === "accepted";
  $("#reviewBar").classList.toggle("accepted", accepted);
  $("#reviewTitle").textContent = accepted ? "本周菜单已接受" : adjustmentMode ? "正在调整本周菜单" : "本周菜单待确认";
  $("#reviewHint").textContent = accepted ? "菜单有变化时仍可继续调整" : adjustmentMode ? "点击表格中的任意菜品进行替换" : "不满意可以替换任意一道菜";
  $("#adjustPlanButton").textContent = adjustmentMode ? "结束调整" : accepted ? "继续调整" : "不接受，调整菜单";
}

function renderRecommendations() {
  const recommendations = ensureWeeklyRecommendations();
  const monday = mondayOf(); const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 6);
  $("#recommendationWeek").textContent = `${formatDate(monday)} - ${formatDate(sunday)}`;
  $("#recommendationGrid").innerHTML = recommendations.map(dish => {
    const added = state.dishes.some(item => item.name === dish.name);
    return `<article class="recommendation-item${added ? " added" : ""}"><h4>${escapeHtml(dish.name)}</h4><p>${escapeHtml(dish.category)} · ${TYPE_LABELS[dish.type]} · ${escapeHtml(dish.cookingMethod)}</p><button class="${added ? "secondary" : "primary"}" data-add-recommendation="${escapeHtml(dish.name)}"${added ? " disabled" : ""}>${added ? "已加入菜库" : "确认加入"}</button></article>`;
  }).join("");
}
function renderDishes() {
  const dishes = state.dishes.filter(dish => currentFilter === "all" || dish.type === currentFilter);
  $("#dishGrid").innerHTML = dishes.length ? dishes.map(dish => `<article class="dish-card"><div class="dish-card-head"><div><h3>${escapeHtml(dish.name)}</h3><span class="tag">${escapeHtml(dish.category || TYPE_LABELS[dish.type])} · ${TYPE_LABELS[dish.type]}</span><span class="tag method">${escapeHtml(dish.cookingMethod || "待选择烹饪方法")}</span></div><button class="delete-button" data-delete="${dish.id}" title="删除菜品" aria-label="删除${escapeHtml(dish.name)}">×</button></div><p>${dishPrice(dish) ? `两人份整体价格 ${money(dishPrice(dish))}` : "待设置两人份整体价格"}</p><div class="dish-actions"><span class="dish-cost">${dishPrice(dish) ? `每道 <strong>${money(dishPrice(dish))}</strong>` : "暂未计价"}</span><button class="text-button" data-edit="${dish.id}">编辑</button></div></article>`).join("") : '<div class="empty">这里还没有菜品</div>';
}

function renderReport() {
  const now = new Date(); const entries = weeklyDishEntries(); const weekly = entries.reduce((sum, row) => sum + dishPrice(row.dish) * row.count, 0);
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); const spend = weekly / 7 * days;
  const frequencies = entries.map(row => [row.dish.name, row.count]).sort((a,b) => b[1] - a[1]); const max = Math.max(...frequencies.map(item => item[1]), 1);
  $("#reportMonth").textContent = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  const unpriced = unpricedScheduledDishes();
  $("#reportSpend").textContent = money(spend); $("#reportBudgetText").textContent = unpriced.length ? `${unpriced.length} 道菜待定价，当前为已知花费` : spend <= state.budget ? `预算内剩余 ${money(state.budget - spend)}` : `超出预算 ${money(spend - state.budget)}`;
  $("#reportMeals").textContent = Math.round(days / 7 * 14); $("#reportVariety").textContent = frequencies.length;
  $("#frequencyList").innerHTML = frequencies.map(([name, count]) => `<div class="frequency-row"><span>${escapeHtml(name)}</span><div class="frequency-bar"><span style="width:${count / max * 100}%"></span></div><strong>${count}次</strong></div>`).join("");
  $("#feedbackInput").value = state.feedback || "";
}

function renderAll() { $("#budgetValue").textContent = money(state.budget); renderPlan(); renderRecommendations(); renderDishes(); renderReport(); }
function openDishDialog(dish = null) {
  editingDishId = dish?.id || null; $("#dialogTitle").textContent = dish ? "编辑菜品" : "添加菜品";
  const form = $("#dishForm"); form.reset(); form.elements.name.value = dish?.name || ""; form.elements.type.value = dish?.type || "lunch"; form.elements.cookingMethod.value = dish?.cookingMethod || ""; form.elements.price.value = dishPrice(dish);
  $("#dishDialog").showModal();
}
function openReplacementDialog(dayIndex, slot) {
  replacementTarget = { dayIndex, slot }; const date = new Date(state.schedule[dayIndex].date);
  const labels = { lunch: "午餐 · 简餐", meat: "晚餐 · 荤菜", vegetable: "晚餐 · 素菜" };
  $("#replaceSlotLabel").textContent = `${formatDate(date)} · ${labels[slot]}`;
  const choices = state.dishes.filter(dish => dish.type === slot && (slot === "lunch" || dish.cookingMethod === "烹饪"));
  $("#replacementDishSelect").innerHTML = choices.map(dish => `<option value="${dish.id}"${dish.id === state.schedule[dayIndex][slot] ? " selected" : ""}>${escapeHtml(dish.name)}</option>`).join("");
  $("#replaceForm").elements.newDishName.value = ""; $("#replaceDialog").showModal();
}

document.addEventListener("click", event => {
  const tab = event.target.closest(".tab"); if (tab) { document.querySelectorAll(".tab,.view").forEach(el => el.classList.remove("active")); tab.classList.add("active"); $(`#${tab.dataset.view}View`).classList.add("active"); }
  const filter = event.target.closest(".filter"); if (filter) { currentFilter = filter.dataset.filter; document.querySelectorAll(".filter").forEach(el => el.classList.remove("active")); filter.classList.add("active"); renderDishes(); }
  const edit = event.target.closest("[data-edit]"); if (edit) openDishDialog(getDish(edit.dataset.edit));
  const del = event.target.closest("[data-delete]"); if (del) { const id = del.dataset.delete; if (state.schedule.some(day => Object.values(day).includes(id))) { toast("这道菜正在本周菜单中，请先重新搭配"); return; } state.dishes = state.dishes.filter(dish => dish.id !== id); save(); renderAll(); }
  const replacement = event.target.closest("[data-replace-day]"); if (replacement) openReplacementDialog(Number(replacement.dataset.replaceDay), replacement.dataset.replaceSlot);
  const addRecommendation = event.target.closest("[data-add-recommendation]");
  if (addRecommendation && !addRecommendation.disabled) {
    const candidate = recommendationPool.find(dish => dish.name === addRecommendation.dataset.addRecommendation);
    if (candidate && !state.dishes.some(dish => dish.name === candidate.name)) {
      state.dishes.push({ ...candidate, id: `d${Date.now()}` });
      save(); renderAll(); toast(`${candidate.name} 已加入菜库`);
    }
  }
});

$("#regenerateButton").onclick = generateSchedule;
$("#addDishButton").onclick = () => openDishDialog();
$("#acceptPlanButton").onclick = () => { state.scheduleStatus = "accepted"; adjustmentMode = false; save(); renderPlan(); toast("本周菜单已接受"); };
$("#adjustPlanButton").onclick = () => { adjustmentMode = !adjustmentMode; if (adjustmentMode) state.scheduleStatus = "draft"; save(); renderPlan(); };
$("#saveReplacementButton").onclick = event => {
  event.preventDefault(); const form = $("#replaceForm"); const newName = form.elements.newDishName.value.trim(); let dishId = form.elements.dishId.value;
  if (newName) {
    const existing = state.dishes.find(dish => dish.name === newName && dish.type === replacementTarget.slot);
    if (existing) dishId = existing.id;
    else { dishId = `d${Date.now()}`; state.dishes.push({ id: dishId, name: newName, type: replacementTarget.slot, cookingMethod: replacementTarget.slot === "lunch" ? "" : "烹饪", category: "自定义", price: 0 }); }
  }
  state.schedule[replacementTarget.dayIndex][replacementTarget.slot] = dishId; state.scheduleStatus = "draft"; save(); renderAll(); $("#replaceDialog").close(); toast(newName ? "新菜已加入菜单和菜库" : "菜单已替换");
};
$("#budgetButton").onclick = () => { $("#budgetForm").elements.budget.value = state.budget; $("#budgetDialog").showModal(); };
$("#saveBudgetButton").onclick = event => { event.preventDefault(); if (!$("#budgetForm").reportValidity()) return; state.budget = Number($("#budgetForm").elements.budget.value); save(); renderAll(); $("#budgetDialog").close(); toast("月预算已更新"); };
$("#saveDishButton").onclick = event => {
  event.preventDefault(); const form = $("#dishForm"); if (!form.reportValidity()) return;
  const previous = editingDishId ? getDish(editingDishId) : null;
  const dish = { id: editingDishId || `d${Date.now()}`, name: form.elements.name.value.trim(), type: form.elements.type.value, cookingMethod: form.elements.cookingMethod.value, category: previous?.category || "自定义", price: Number(form.elements.price.value) };
  const invalidatesDinner = editingDishId && dish.cookingMethod !== "烹饪" && state.schedule.some(day => day.meat === editingDishId || day.vegetable === editingDishId);
  if (editingDishId) state.dishes = state.dishes.map(item => item.id === editingDishId ? dish : item); else state.dishes.push(dish);
  save(); $("#dishDialog").close();
  if (invalidatesDinner) { generateSchedule(); toast("菜品已更新，晚餐已重新搭配"); }
  else { renderAll(); toast(editingDishId ? "菜品已更新" : "菜品已添加"); }
};
$("#copyButton").onclick = async () => {
  const entries = weeklyDishEntries(); const total = entries.reduce((sum, row) => sum + dishPrice(row.dish) * row.count, 0);
  const text = ["本周二人家庭菜品费用", ...entries.map(row => `${row.dish.name} × ${row.count}｜${money(dishPrice(row.dish))}/道｜${money(dishPrice(row.dish) * row.count)}`), `合计：${money(total)}`].join("\n");
  try { await navigator.clipboard.writeText(text); toast("费用清单已复制"); } catch { toast("浏览器未允许复制，请手动选择清单"); }
};
$("#saveFeedbackButton").onclick = () => { state.feedback = $("#feedbackInput").value.trim(); save(); $("#feedbackSaved").textContent = `已保存于 ${new Date().toLocaleString("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`; toast("下月调整意见已保存"); };

if (!scheduleIsCurrent()) generateSchedule(); else { save(); renderAll(); }
