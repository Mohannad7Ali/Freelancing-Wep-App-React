// src/utils/reviewValidation.js
const BAD_WORDS = [
  "ابله","غبي","سخيف","قذر","تافه","fuck","shit","bitch"
];

const urlRegex = /(https?:\/\/|www\.)\S+/i;
const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const onlyEmojiRegex = /^(?:\p{Extended_Pictographic}|\p{Emoji_Component}|\s)+$/u;

export function validateReview(text) {
  const errors = [];
  const raw = (text || "").trim();

  if (!raw) errors.push("النص فارغ.");
  if (raw.length < 20) errors.push("الرجاء كتابة مراجعة أطول (20 حرفًا على الأقل).");

  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length < 4) errors.push("الرجاء كتابة جملة واضحة تحتوي على 4 كلمات على الأقل.");

  if (urlRegex.test(raw)) errors.push("يُمنع إدراج روابط في المراجعة.");
  if (emailRegex.test(raw)) errors.push("يُمنع إدراج بريد إلكتروني في المراجعة.");

  const foundBad = BAD_WORDS.find(w => new RegExp(`\\b${w}\\b`, "i").test(raw));
  if (foundBad) errors.push("الرجاء تجنّب استخدام الألفاظ المسيئة.");

  if (onlyEmojiRegex.test(raw)) errors.push("الرجاء كتابة جملة مفيدة وليس إيموجي فقط.");

  const repeatChar = /(.)\1{4,}/u;
  if (repeatChar.test(raw)) errors.push("الرجاء تجنّب التكرار المبالغ فيه للأحرف.");

  return {
    ok: errors.length === 0,
    errors,
  };
}
