import type { Lang } from "@/config/site";

/**
 * Minimal UI dictionary. Long-form story copy stays in config/site.ts;
 * extend this table (or swap for next-intl) to translate more strings.
 */
export const dict: Record<Lang, Record<string, string>> = {
  en: { explore: "Explore the residences", scroll: "Scroll to enter", enquire: "Request private viewing", menu: "Private Collection", sound: "Sound", view3d: "View in 3D", brochure: "Download brochure", enquireUnit: "Enquire about this unit", price: "Starting price", onRequest: "On request" },
  ar: { explore: "اكتشف الإقامات", scroll: "مرر للدخول", enquire: "اطلب زيارة خاصة", menu: "المجموعة الخاصة", sound: "الصوت", view3d: "عرض ثلاثي الأبعاد", brochure: "تحميل الكتيب", enquireUnit: "استفسر عن هذه الوحدة", price: "السعر ابتداءً من", onRequest: "عند الطلب" },
  zh: { explore: "探索住宅", scroll: "向下滚动进入", enquire: "预约私人参观", menu: "私享系列", sound: "声音", view3d: "三维查看", brochure: "下载手册", enquireUnit: "咨询此户型", price: "起价", onRequest: "待询" },
  ru: { explore: "Откройте резиденции", scroll: "Прокрутите, чтобы войти", enquire: "Запросить частный показ", menu: "Частная коллекция", sound: "Звук", view3d: "Смотреть в 3D", brochure: "Скачать брошюру", enquireUnit: "Запрос по этой квартире", price: "Цена от", onRequest: "По запросу" },
  fr: { explore: "Découvrir les résidences", scroll: "Défilez pour entrer", enquire: "Demander une visite privée", menu: "Collection privée", sound: "Son", view3d: "Voir en 3D", brochure: "Télécharger la brochure", enquireUnit: "Se renseigner sur ce lot", price: "À partir de", onRequest: "Sur demande" },
};

export const rtl: Lang[] = ["ar"];
