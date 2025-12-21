import { Quote } from './types';

// ---------------------------------------------------------
// GOOGLE SHEETS CONFIGURATION
// ---------------------------------------------------------
// The URL is now managed via LocalStorage through the UI.
// This constant acts as a fallback or initial hint if needed.
export const DEFAULT_SCRIPT_URL = ""; 

export const APP_STORAGE_KEY = 'zen_mala_data';
export const USER_ID_KEY = 'zen_mala_user_id';
export const USER_NAME_KEY = 'zen_mala_user_name';
export const USER_GROUP_KEY = 'zen_mala_user_group';
export const SHEET_URL_KEY = 'zen_mala_sheet_url';

export const USER_GROUPS = [
  "台南一組",
  "台南二組",
  "台南三組",
  "台南四組"
];

export const BUDDHA_IMAGES = [
  "https://lh3.googleusercontent.com/pw/AP1GczMeQlCQUMspA7it8glT3FjlAnJY9tWVJUE8xRc8J-_cjOOtG0xm3_ombNpWIMCCu3Z8D9q_knzo1fI5nJsZ9oqBS113R3ifhr6QE6oc7KpapeA63jw=w1920-h1080",
  "https://lh3.googleusercontent.com/pw/AP1GczPdS2EKMXmMv9WvO8RlVLKPdZlkGUVlGyVhzqDLEaaB_JaW2wSHm5D5X-bnuqYDW8_VOfq4fijcr-kkNpnpYocl3QFxvpUYrbsEDCAyZwAzhXQ1G4U=w1920-h1080",
  "https://lh3.googleusercontent.com/pw/AP1GczN5UGWwq4Iq8c8cFRI0fdmgyRdURdBilp3s0NkE28caxK63g_y784bmp0PJySQXiao-rLWRxzo2zgcW_0d02D2Z4wE3BsZiBWCeJqVvoG2tdX_lchw=w1920-h1080",
  "https://lh3.googleusercontent.com/pw/AP1GczN4OeBiKDiFzqivKrtkODXm-0a71Pb924H3cyii9-DP296Gc5-jIKvxKcPdT9nHtRkwbghrcWUwe6Q9SKGIsF1AjPg1xi8N0za5iStEfjA1ciCt1RQ=w1920-h1080"
];

export const QUOTES: Quote[] = [
  { text: "諸惡莫作，眾善奉行，自淨其意，是諸佛教。" },
  { text: "不實修，難抵擋世間誘惑。" },
  { text: "養成什麼習氣，就有什麼過患。" },
  { text: "一切不善的分別念，都會招感苦果。" },
  { text: "以信心行布施才能真得功德。" },
  { text: "沒有智慧的定見，不能解脫煩惱。" },
  { text: "過去心不可得，現在心不可得，未來心不可得。" },
  { text: "此生幸得暇滿船，自他須度生死海，故於晝夜不懈怠，聞思修是佛子行。" },
  { text: "貪愛親眷如水盪，瞋憎怨敵似火燃，癡昧取捨猶黑暗，離家鄉是佛子行。" },
  { text: "捨離惡境惑漸減，棄除散亂善自增，自心清淨起正見，依靜處是佛子行。" },
  { text: "長伴親友須別離，勤聚之財必捐棄，識客終離客舍身，捨世執戀佛子行。" },
  { text: "伴隨惡友三毒盛，聞思修德漸壞少，慈悲喜捨令退失，遠離惡友佛子行。" },
  { text: "依善知識罪漸消，功德增如上弦月，珍視智慧聖導師，重於自身佛子行。" },
  { text: "自身仍陷輪迴獄，世間神祇能護誰，應依殊勝無虛者，皈依三寶佛子行。" },
  { text: "諸極難忍惡趣苦，世尊說為惡業果，縱須捨命為代價，亦不造罪佛子行。" },
  { text: "三界樂如草頭露，均屬剎那壞滅法，不變無上解脫道，奮起希求佛子行。" },
  { text: "無始劫來慈憫恩，諸母若苦我何樂，為度無邊有情故，發菩提心佛子行。" },
  { text: "諸苦源於貪己樂，諸佛生於利他心，故於自樂與他苦，如實修換佛子行。" },
  { text: "縱他因貪親盜取，或令旁人奪我財，猶將身財三時善，迴向於彼佛子行。" },
  { text: "我雖無有何罪過，竟有人欲斷吾頭，然以悲心於諸罪，自身代受佛子行。" },
  { text: "縱人百般中傷我，醜聞謠傳遍三千，吾猶深懷悲憫心，讚嘆他德佛子行。" },
  { text: "若人於眾集會中，揭我隱私出惡言，猶視彼如善導師，恭敬致禮佛子行。" },
  { text: "護養於他若己子，其反視我如仇敵，仍似慈母憐病兒，倍加悲憫佛子行。" },
  { text: "其若等同或低劣，心懷傲慢侮蔑我，吾亦敬彼如上師，恆常頂戴佛子行。" },
  { text: "縱因貧困受輕賤，復遭重病及魔障，眾生罪苦己代受，無怯懦心佛子行。" },
  { text: "雖富盛名眾人敬，財寶等齊多聞天，猶觀榮華無實義，離驕慢心佛子行。" },
  { text: "若未降除內瞋敵，外敵雖伏旋增盛，故應速以慈悲軍，降伏自心佛子行。" },
  { text: "三界欲樂如鹽水，渴求轉增無饜足，於諸能生貪著物，即刻捨離佛子行。" },
  { text: "諸法所顯唯自心，性體本離戲論邊，不著能取所取相，心不作意佛子行。" },
  { text: "遭逢欣喜悅意境，應觀猶如夏時虹，外象美麗內無實，捨離貪執佛子行。" },
  { text: "諸苦猶如夢子死，妄執實有極憂惱，故於違緣逆境時，當觀虛妄佛子行。" },
  { text: "為求菩提身尚捨，身外物自不待言，布施不盼異熟果，不求回報佛子行。" },
  { text: "無戒自利尚不成，欲求利他豈可能？故於世樂不希求，勤護戒律佛子行。" },
  { text: "欲積福善諸佛子，應觀怨家如寶藏，於眾生捨瞋惡心，修習寬忍佛子行。" },
  { text: "見求自利二乘士，勤修行如救頭燃，利眾生為善德源，歡喜精進佛子行。" },
  { text: "甚深禪定生慧觀，摧盡業障煩惱魔，知已應離四無色，修習靜慮佛子行。" },
  { text: "五度若無智慧導，菩提正覺難圓成，認知三輪實體空，智巧合一佛子行。" }, 
  { text: "若不省察己過錯，披佛外衣行非法，故當恆常行觀照，斷除己過佛子行。" },
  { text: "我因煩惱道他過，減損功德徒退轉，故於菩薩諸缺失，切莫議論佛子行。" },
  { text: "因求利敬起爭執，聞思修業漸退轉，故於親友施主家，捨離貪戀佛子行。" },
  { text: "粗言惡語惱人心，復傷佛子諸行儀，令人不悅之惡口，捨棄莫說佛子行。" },
  { text: "煩惱串習難對治，覺智之士正念持，貪瞋癡心初萌起，即時摧滅佛子行。" },
  { text: "無論何時行何事，應觀自心之相狀，恆繫正念與正知，成辦利他佛子行。" },
  { text: "由此精勤所修善，為除無邊眾生苦，咸以三輪清淨慧，迴向菩提佛子行。" },
];