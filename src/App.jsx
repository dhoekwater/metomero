import React, { useEffect, useRef, useState } from 'react';
import { FastForward, Navigation2, Volume2, VolumeX, Music, Mic, ZoomIn, ZoomOut } from 'lucide-react';

// --- Tokyo Metro Station Coordinates & Data ---
const STATIONS = {
  "Y01": { id: "Y01", name: "Ikebukuro", nameJp: "池袋", nameKana: "いけぶくろ", x: 350, y: 150, textOffset: [-85, 8] },
  "Y02": { id: "Y02", name: "Otsuka", nameJp: "大塚", nameKana: "おおつか", x: 430, y: 140 },
  "Y03": { id: "Y03", name: "Sugamo", nameJp: "巣鴨", nameKana: "すがも", x: 500, y: 140 },
  "Y04": { id: "Y04", name: "Komagome", nameJp: "駒込", nameKana: "こまごめ", x: 570, y: 150 },
  "Y05": { id: "Y05", name: "Tabata", nameJp: "田端", nameKana: "たばた", x: 630, y: 180 },
  "Y06": { id: "Y06", name: "Nishi-Nippori", nameJp: "西日暮里", nameKana: "にしにっぽり", x: 670, y: 220 },
  "Y07": { id: "Y07", name: "Nippori", nameJp: "日暮里", nameKana: "にっぽり", x: 690, y: 260 },
  "Y08": { id: "Y08", name: "Uguisudani", nameJp: "鶯谷", nameKana: "うぐいすだに", x: 710, y: 300 },
  "Y09": { id: "Y09", name: "Ueno", nameJp: "上野", nameKana: "うえの", x: 720, y: 350, textOffset: [20, -8] },
  "Y10": { id: "Y10", name: "Okachimachi", nameJp: "御徒町", nameKana: "おかちまち", x: 720, y: 400 },
  "Y11": { id: "Y11", name: "Akihabara", nameJp: "秋葉原", nameKana: "あきはばら", x: 710, y: 450 },
  "Y12": { id: "Y12", name: "Kanda", nameJp: "神田", nameKana: "かんだ", x: 690, y: 500 },
  "Y13": { id: "Y13", name: "Tokyo", nameJp: "東京", nameKana: "とうきょう", x: 660, y: 550, textOffset: [20, 8] },
  "Y14": { id: "Y14", name: "Yurakucho", nameJp: "有楽町", nameKana: "ゆうらくちょう", x: 620, y: 600 },
  "Y15": { id: "Y15", name: "Shimbashi", nameJp: "新橋", nameKana: "しんばし", x: 570, y: 650 },
  "Y16": { id: "Y16", name: "Hamamatsucho", nameJp: "浜松町", nameKana: "はままつちょう", x: 520, y: 680 },
  "Y17": { id: "Y17", name: "Tamachi", nameJp: "田町", nameKana: "たまち", x: 440, y: 700 },
  "Y18": { id: "Y18", name: "Takanawa Gateway", nameJp: "高輪ゲートウェイ", nameKana: "たかなわげーとうぇい", x: 370, y: 700 },
  "Y19": { id: "Y19", name: "Shinagawa", nameJp: "品川", nameKana: "しながわ", x: 300, y: 690, textOffset: [-85, 8] },
  "Y20": { id: "Y20", name: "Osaki", nameJp: "大崎", nameKana: "おおさき", x: 220, y: 660 },
  "Y21": { id: "Y21", name: "Gotanda", nameJp: "五反田", nameKana: "ごたんだ", x: 180, y: 610 },
  "Y22": { id: "Y22", name: "Meguro", nameJp: "目黒", nameKana: "めぐろ", x: 150, y: 550 },
  "Y23": { id: "Y23", name: "Ebisu", nameJp: "恵比寿", nameKana: "えびす", x: 130, y: 490 },
  "Y24": { id: "Y24", name: "Shibuya", nameJp: "渋谷", nameKana: "しぶや", x: 130, y: 420, textOffset: [-75, 8] },
  "Y25": { id: "Y25", name: "Harajuku", nameJp: "原宿", nameKana: "はらじゅく", x: 140, y: 350 },
  "Y26": { id: "Y26", name: "Yoyogi", nameJp: "代々木", nameKana: "よよぎ", x: 160, y: 290 },
  "Y27": { id: "Y27", name: "Shinjuku", nameJp: "新宿", nameKana: "しんじゅく", x: 180, y: 240, textOffset: [-75, 8] },
  "Y28": { id: "Y28", name: "Shin-Okubo", nameJp: "新大久保", nameKana: "しんおおくぼ", x: 220, y: 180 },
  "Y29": { id: "Y29", name: "Takadanobaba", nameJp: "高田馬場", nameKana: "たかだのばば", x: 260, y: 160 },
  "Y30": { id: "Y30", name: "Mejiro", nameJp: "目白", nameKana: "めじろ", x: 300, y: 150 },

  "G02": { id: "G02", name: "Omotesando", nameJp: "表参道", nameKana: "おもてさんどう", x: 190, y: 430 },
  "G03": { id: "G03", name: "Gaienmae", nameJp: "外苑前", nameKana: "がいえんまえ", x: 240, y: 440 },
  "G04": { id: "G04", name: "Aoyama-itchome", nameJp: "青山一丁目", nameKana: "あおやまいっちょうめ", x: 290, y: 450 },
  "G05": { id: "G05", name: "Akasaka-mitsuke", nameJp: "赤坂見附", nameKana: "あかさかみつけ", x: 360, y: 460 },
  "G06": { id: "G06", name: "Tameike-sanno", nameJp: "溜池山王", nameKana: "ためいけさんのう", x: 420, y: 500 },
  "G07": { id: "G07", name: "Toranomon", nameJp: "虎ノ門", nameKana: "とらのもん", x: 480, y: 560 },
  "G09": { id: "G09", name: "Ginza", nameJp: "銀座", nameKana: "ぎんざ", x: 640, y: 620, textOffset: [20, 14] },
  "G10": { id: "G10", name: "Kyobashi", nameJp: "京橋", nameKana: "きょうばし", x: 670, y: 590 },
  "G11": { id: "G11", name: "Nihombashi", nameJp: "日本橋", nameKana: "にほんばし", x: 700, y: 550 },
  "G12": { id: "G12", name: "Mitsukoshimae", nameJp: "三越前", nameKana: "みつこしまえ", x: 720, y: 510 },
  "G14": { id: "G14", name: "Suehirocho", nameJp: "末広町", nameKana: "すえひろちょう", x: 720, y: 450 },
  "G15": { id: "G15", name: "Ueno-hirokoji", nameJp: "上野広小路", nameKana: "うえのひろこうじ", x: 730, y: 400 },
  "G17": { id: "G17", name: "Inaricho", nameJp: "稲荷町", nameKana: "いなりちょう", x: 780, y: 340 },
  "G18": { id: "G18", name: "Tawaramachi", nameJp: "田原町", nameKana: "たわらまち", x: 840, y: 330 },
  "G19": { id: "G19", name: "Asakusa", nameJp: "浅草", nameKana: "あさくさ", x: 900, y: 320, textOffset: [18, 0] },

  "M01": { id: "M01", name: "Ogikubo", nameJp: "荻窪", nameKana: "おぎくぼ", x: 50, y: 150 },
  "M02": { id: "M02", name: "Minami-asagaya", nameJp: "南阿佐ケ谷", nameKana: "みなみあさがや", x: 80, y: 160 },
  "M03": { id: "M03", name: "Shin-koenji", nameJp: "新高円寺", nameKana: "しんこうえんじ", x: 110, y: 170 },
  "M04": { id: "M04", name: "Higashi-koenji", nameJp: "東高円寺", nameKana: "ひがしこうえんじ", x: 130, y: 180 },
  "M05": { id: "M05", name: "Shin-nakano", nameJp: "新中野", nameKana: "しんなかの", x: 150, y: 190 },
  "M06": { id: "M06", name: "Nakano-sakaue", nameJp: "中野坂上", nameKana: "なかのさかうえ", x: 160, y: 200 },
  "M07": { id: "M07", name: "Nishi-shinjuku", nameJp: "西新宿", nameKana: "にししんじゅく", x: 170, y: 220 },
  "M09": { id: "M09", name: "Shinjuku-sanchome", nameJp: "新宿三丁目", nameKana: "しんじゅくさんちょうめ", x: 220, y: 260 },
  "M10": { id: "M10", name: "Shinjuku-gyoenmae", nameJp: "新宿御苑前", nameKana: "しんじゅくぎょえんまえ", x: 260, y: 280 },
  "M11": { id: "M11", name: "Yotsuya-sanchome", nameJp: "四谷三丁目", nameKana: "よつやさんちょうめ", x: 300, y: 320 },
  "M12": { id: "M12", name: "Yotsuya", nameJp: "四ツ谷", nameKana: "よつや", x: 330, y: 370 },
  "M14": { id: "M14", name: "Kokkai-gijidomae", nameJp: "国会議事堂前", nameKana: "こっかいぎじどうまえ", x: 440, y: 520 },
  "M15": { id: "M15", name: "Kasumigaseki", nameJp: "霞ケ関", nameKana: "かすみがせき", x: 510, y: 580 },
  "M18": { id: "M18", name: "Otemachi", nameJp: "大手町", nameKana: "おおてまち", x: 680, y: 490, textOffset: [20, -8] },
  "M19": { id: "M19", name: "Awajicho", nameJp: "淡路町", nameKana: "あわじちょう", x: 640, y: 430 },
  "M20": { id: "M20", name: "Ochanomizu", nameJp: "御茶ノ水", nameKana: "おちゃのみず", x: 600, y: 380 },
  "M21": { id: "M21", name: "Hongo-sanchome", nameJp: "本郷三丁目", nameKana: "ほんごうさんちょうめ", x: 550, y: 330 },
  "M22": { id: "M22", name: "Korakuen", nameJp: "後楽園", nameKana: "こうらくえん", x: 500, y: 270 },
  "M23": { id: "M23", name: "Myogadani", nameJp: "茗荷谷", nameKana: "みょうがだに", x: 450, y: 220 },
  "M24": { id: "M24", name: "Shin-otsuka", nameJp: "新大塚", nameKana: "しんおおつか", x: 400, y: 180 },

  "H04": { id: "H04", name: "Nagatacho", nameJp: "永田町", nameKana: "ながたちょう", x: 420, y: 470 },
  "H05": { id: "H05", name: "Hanzomon", nameJp: "半蔵門", nameKana: "はんぞうもん", x: 480, y: 440 },
  "H06": { id: "H06", name: "Kudanshita", nameJp: "九段下", nameKana: "くだんした", x: 530, y: 420 },
  "H07": { id: "H07", name: "Jimbocho", nameJp: "神保町", nameKana: "じんぼうちょう", x: 580, y: 440 },
  "H10": { id: "H10", name: "Suitengumae", nameJp: "水天宮前", nameKana: "すいてんぐうまえ", x: 780, y: 540 },
  "H11": { id: "H11", name: "Kiyosumi-shirakawa", nameJp: "清澄白河", nameKana: "きよすみしらかわ", x: 840, y: 550 },
  "H12": { id: "H12", name: "Sumiyoshi", nameJp: "住吉", nameKana: "すみよし", x: 890, y: 510 },
  "H13": { id: "H13", name: "Kinshicho", nameJp: "錦糸町", nameKana: "きんしちょう", x: 930, y: 450 },
  "H14": { id: "H14", name: "Oshiage", nameJp: "押上", nameKana: "おしあげ", x: 950, y: 380 },

  "T01": { id: "T01", name: "Nakano", nameJp: "中野", nameKana: "なかの", x: 120, y: 150 },
  "T02": { id: "T02", name: "Ochiai", nameJp: "落合", nameKana: "おちあい", x: 180, y: 140 },
  "T04": { id: "T04", name: "Waseda", nameJp: "早稲田", nameKana: "わせだ", x: 330, y: 180 },
  "T05": { id: "T05", name: "Kagurazaka", nameJp: "神楽坂", nameKana: "かぐらざか", x: 410, y: 220 },
  "T06": { id: "T06", name: "Iidabashi", nameJp: "飯田橋", nameKana: "いいだばし", x: 480, y: 290 },
  "T08": { id: "T08", name: "Takebashi", nameJp: "竹橋", nameKana: "たけばし", x: 620, y: 460 },
  "T11": { id: "T11", name: "Kayabacho", nameJp: "茅場町", nameKana: "かやばちょう", x: 740, y: 590 },
  "T12": { id: "T12", name: "Monzen-nakacho", nameJp: "門前仲町", nameKana: "もんぜんなかちょう", x: 800, y: 620 },
  "T13": { id: "T13", name: "Kiba", nameJp: "木場", nameKana: "きば", x: 850, y: 630 },
  "T14": { id: "T14", name: "Toyocho", nameJp: "東陽町", nameKana: "とうようちょう", x: 910, y: 630 },

  "Hb01": { id: "Hb01", name: "Naka-meguro", nameJp: "中目黒", nameKana: "なかめぐろ", x: 100, y: 520 },
  "Hb03": { id: "Hb03", name: "Hiroo", nameJp: "広尾", nameKana: "ひろお", x: 180, y: 520 },
  "Hb04": { id: "Hb04", name: "Roppongi", nameJp: "六本木", nameKana: "ろっぽんぎ", x: 300, y: 540 },
  "Hb05": { id: "Hb05", name: "Kamiyacho", nameJp: "神谷町", nameKana: "かみやちょう", x: 400, y: 600 },
  "Hb06": { id: "Hb06", name: "Toranomon Hills", nameJp: "虎ノ門ヒルズ", nameKana: "とらのもんひるず", x: 460, y: 600 },
  "Hb08": { id: "Hb08", name: "Hibiya", nameJp: "日比谷", nameKana: "ひびや", x: 580, y: 580 },
  "Hb10": { id: "Hb10", name: "Higashi-ginza", nameJp: "東銀座", nameKana: "ひがしぎんざ", x: 680, y: 630 },
  "Hb11": { id: "Hb11", name: "Tsukiji", nameJp: "築地", nameKana: "つきじ", x: 720, y: 650 },
  "Hb12": { id: "Hb12", name: "Hatchobori", nameJp: "八丁堀", nameKana: "はっちょうぼり", x: 750, y: 580 },
  "Hb14": { id: "Hb14", name: "Ningyocho", nameJp: "人形町", nameKana: "にんぎょうちょう", x: 750, y: 520 },
  "Hb15": { id: "Hb15", name: "Kodemmacho", nameJp: "小伝馬町", nameKana: "こでんまちょう", x: 750, y: 480 },
  "Hb17": { id: "Hb17", name: "Naka-okachimachi", nameJp: "仲御徒町", nameKana: "なかおかちまち", x: 730, y: 410 },
  "Hb19": { id: "Hb19", name: "Iriya", nameJp: "入谷", nameKana: "いりや", x: 750, y: 280 },
  "Hb20": { id: "Hb20", name: "Minowa", nameJp: "三ノ輪", nameKana: "みのわ", x: 780, y: 220 },
  "Hb21": { id: "Hb21", name: "Minami-senju", nameJp: "南千住", nameKana: "みなみせんじゅ", x: 820, y: 180 },
  "Hb22": { id: "Hb22", name: "Kita-senju", nameJp: "北千住", nameKana: "きたせんじゅ", x: 860, y: 140 },

  "C01": { id: "C01", name: "Yoyogi-uehara", nameJp: "代々木上原", nameKana: "よよぎうえはら", x: 80, y: 350 },
  "C02": { id: "C02", name: "Yoyogi-koen", nameJp: "代々木公園", nameKana: "よよぎこうえん", x: 110, y: 370 },
  "C03": { id: "C03", name: "Meiji-jingumae", nameJp: "明治神宮前", nameKana: "めいじじんぐうまえ", x: 140, y: 350 },
  "C05": { id: "C05", name: "Nogizaka", nameJp: "乃木坂", nameKana: "のぎざか", x: 250, y: 480 },
  "C06": { id: "C06", name: "Akasaka", nameJp: "赤坂", nameKana: "あかさか", x: 360, y: 500 },
  "C10": { id: "C10", name: "Nijubashimae", nameJp: "二重橋前", nameKana: "にじゅうばしまえ", x: 630, y: 530 },
  "C12": { id: "C12", name: "Shin-ochanomizu", nameJp: "新御茶ノ水", nameKana: "しんおちゃのみず", x: 600, y: 390 },
  "C13": { id: "C13", name: "Yushima", nameJp: "湯島", nameKana: "ゆしま", x: 650, y: 350 },
  "C14": { id: "C14", name: "Nezu", nameJp: "根津", nameKana: "ねづ", x: 630, y: 280 },
  "C15": { id: "C15", name: "Sendagi", nameJp: "千駄木", nameKana: "せんだぎ", x: 610, y: 230 },
  "C17": { id: "C17", name: "Machiya", nameJp: "町屋", nameKana: "まちや", x: 750, y: 180 },
  "C19": { id: "C19", name: "Ayase", nameJp: "綾瀬", nameKana: "あやせ", x: 920, y: 110 },
  "C20": { id: "C20", name: "Kita-ayase", nameJp: "北綾瀬", nameKana: "きたあやせ", x: 950, y: 80 },

  "Yu01": { id: "Yu01", name: "Wakoshi", nameJp: "和光市", nameKana: "わこうし", x: 50, y: 50 },
  "Yu02": { id: "Yu02", name: "Chikatetsu-narimasu", nameJp: "地下鉄成増", nameKana: "ちかてつなります", x: 80, y: 70 },
  "Yu03": { id: "Yu03", name: "Chikatetsu-akatsuka", nameJp: "地下鉄赤塚", nameKana: "ちかてつあかつか", x: 110, y: 90 },
  "Yu04": { id: "Yu04", name: "Heiwadai", nameJp: "平和台", nameKana: "へいわだい", x: 150, y: 100 },
  "Yu05": { id: "Yu05", name: "Hikawadai", nameJp: "氷川台", nameKana: "ひかわだい", x: 200, y: 110 },
  "Yu06": { id: "Yu06", name: "Kotake-mukaihara", nameJp: "小竹向原", nameKana: "こたけむかいはら", x: 250, y: 120 },
  "Yu07": { id: "Yu07", name: "Senkawa", nameJp: "千川", nameKana: "せんかわ", x: 280, y: 130 },
  "Yu08": { id: "Yu08", name: "Kanamecho", nameJp: "要町", nameKana: "かなめちょう", x: 310, y: 140 },
  "Yu10": { id: "Yu10", name: "Higashi-ikebukuro", nameJp: "東池袋", nameKana: "ひがしいけぶくろ", x: 400, y: 170 },
  "Yu11": { id: "Yu11", name: "Gokokuji", nameJp: "護国寺", nameKana: "ごこくじ", x: 440, y: 200 },
  "Yu12": { id: "Yu12", name: "Edogawabashi", nameJp: "江戸川橋", nameKana: "えどがわばし", x: 460, y: 240 },
  "Yu14": { id: "Yu14", name: "Ichigaya", nameJp: "市ケ谷", nameKana: "いちがや", x: 400, y: 340 },
  "Yu15": { id: "Yu15", name: "Kojimachi", nameJp: "麹町", nameKana: "こうじまち", x: 420, y: 410 },
  "Yu17": { id: "Yu17", name: "Sakuradamon", nameJp: "桜田門", nameKana: "さくらだもん", x: 520, y: 520 },
  "Yu19": { id: "Yu19", name: "Ginza-itchome", nameJp: "銀座一丁目", nameKana: "ぎんざいっちょうめ", x: 650, y: 600 },
  "Yu20": { id: "Yu20", name: "Shintomicho", nameJp: "新富町", nameKana: "しんとみちょう", x: 700, y: 630 },
  "Yu21": { id: "Yu21", name: "Tsukishima", nameJp: "月島", nameKana: "つきしま", x: 760, y: 670 },
  "Yu22": { id: "Yu22", name: "Toyosu", nameJp: "豊洲", nameKana: "とよす", x: 820, y: 720 },
  "Yu23": { id: "Yu23", name: "Tatsumi", nameJp: "辰巳", nameKana: "たつみ", x: 880, y: 750 },
  "Yu24": { id: "Yu24", name: "Shin-kiba", nameJp: "新木場", nameKana: "しんきば", x: 940, y: 780 },

  "N02": { id: "N02", name: "Shirokanedai", nameJp: "白金台", nameKana: "しろかねだい", x: 200, y: 580 },
  "N03": { id: "N03", name: "Shirokane-takanawa", nameJp: "白金高輪", nameKana: "しろかねたかなわ", x: 250, y: 600 },
  "N04": { id: "N04", name: "Azabu-juban", nameJp: "麻布十番", nameKana: "あざぶじゅうばん", x: 320, y: 580 },
  "N05": { id: "N05", name: "Roppongi-itchome", nameJp: "六本木一丁目", nameKana: "ろっぽんぎいっちょうめ", x: 350, y: 520 },
  "N12": { id: "N12", name: "Todaimae", nameJp: "東大前", nameKana: "とうだいまえ", x: 550, y: 230 },
  "N13": { id: "N13", name: "Hon-komagome", nameJp: "本駒込", nameKana: "ほんこまごめ", x: 550, y: 180 },
  "N15": { id: "N15", name: "Nishigahara", nameJp: "西ケ原", nameKana: "にしがはら", x: 600, y: 120 },
  "N16": { id: "N16", name: "Oji", nameJp: "王子", nameKana: "おうじ", x: 620, y: 90 },
  "N17": { id: "N17", name: "Oji-kamiya", nameJp: "王子神谷", nameKana: "おうじかみや", x: 650, y: 60 },
  "N18": { id: "N18", name: "Shimo", nameJp: "志茂", nameKana: "しも", x: 680, y: 40 },
  "N19": { id: "N19", name: "Akabane-iwabuchi", nameJp: "赤羽岩淵", nameKana: "あかばねいわぶち", x: 710, y: 20 },

  "F10": { id: "F10", name: "Zoshigaya", nameJp: "雑司が谷", nameKana: "ぞうしがや", x: 330, y: 190 },
  "F11": { id: "F11", name: "Nishi-waseda", nameJp: "西早稲田", nameKana: "にしわせだ", x: 280, y: 210 },
  "F12": { id: "F12", name: "Higashi-shinjuku", nameJp: "東新宿", nameKana: "ひがししんじゅく", x: 250, y: 230 },
  "F14": { id: "F14", name: "Kita-sando", nameJp: "北参道", nameKana: "きたさんどう", x: 180, y: 320 }
};

const LINES = [
  {
    id: "yamanote", name: "Yamanote Line", nameJp: "山手線", color: "#8BC34A", isLoop: true, tripMinutes: 60, trainIntervalMinutes: 3,
    stations: ["Y01", "Y02", "Y03", "Y04", "Y05", "Y06", "Y07", "Y08", "Y09", "Y10", "Y11", "Y12", "Y13", "Y14", "Y15", "Y16", "Y17", "Y18", "Y19", "Y20", "Y21", "Y22", "Y23", "Y24", "Y25", "Y26", "Y27", "Y28", "Y29", "Y30", "Y01"]
  },
  {
    id: "marunouchi", name: "Marunouchi Line", nameJp: "丸ノ内線", color: "#F44336", isLoop: false, tripMinutes: 50, trainIntervalMinutes: 3,
    stations: ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "Y27", "M09", "M10", "M11", "M12", "G05", "M14", "M15", "G09", "Y13", "M18", "M19", "M20", "M21", "M22", "M23", "M24", "Y01"]
  },
  {
    id: "ginza", name: "Ginza Line", nameJp: "銀座線", color: "#FFB700", isLoop: false, tripMinutes: 35, trainIntervalMinutes: 3,
    stations: ["Y24", "G02", "G03", "G04", "G05", "G06", "G07", "Y15", "G09", "G10", "G11", "G12", "Y12", "G14", "G15", "Y09", "G17", "G18", "G19"]
  },
  {
    id: "chuo", name: "Chūō Line (Rapid)", nameJp: "中央線（快速）", color: "#F47920", isLoop: false, tripMinutes: 15, trainIntervalMinutes: 4,
    stations: ["Y27", "M12", "M20", "Y12", "Y13"]
  },
  {
    id: "hanzomon", name: "Hanzōmon Line", nameJp: "半蔵門線", color: "#8F76D6", isLoop: false, tripMinutes: 30, trainIntervalMinutes: 5,
    stations: ["Y24", "G02", "G04", "H04", "H05", "H06", "H07", "M18", "G12", "H10", "H11", "H12", "H13", "H14"]
  },
  {
    id: "tozai", name: "Tōzai Line", nameJp: "東西線", color: "#00A7DB", isLoop: false, tripMinutes: 40, trainIntervalMinutes: 4,
    stations: ["T01", "T02", "Y29", "T04", "T05", "T06", "H06", "T08", "M18", "G11", "T11", "T12", "T13", "T14"]
  },
  {
    id: "hibiya", name: "Hibiya Line", nameJp: "日比谷線", color: "#B5B5AC", isLoop: false, tripMinutes: 45, trainIntervalMinutes: 4,
    stations: ["Hb01", "Y23", "Hb03", "Hb04", "Hb05", "Hb06", "M15", "Hb08", "G09", "Hb10", "Hb11", "Hb12", "T11", "Hb14", "Hb15", "Y11", "Hb17", "Y09", "Hb19", "Hb20", "Hb21", "Hb22"]
  },
  {
    id: "chiyoda", name: "Chiyoda Line", nameJp: "千代田線", color: "#00BB85", isLoop: false, tripMinutes: 40, trainIntervalMinutes: 4,
    stations: ["C01", "C02", "C03", "G02", "C05", "C06", "M14", "M15", "Hb08", "C10", "M18", "C12", "C13", "C14", "C15", "Y06", "C17", "Hb22", "C19", "C20"]
  },
  {
    id: "yurakucho", name: "Yūrakuchō Line", nameJp: "有楽町線", color: "#D7C25D", isLoop: false, tripMinutes: 50, trainIntervalMinutes: 5,
    stations: ["Yu01", "Yu02", "Yu03", "Yu04", "Yu05", "Yu06", "Yu07", "Yu08", "Y01", "Yu10", "Yu11", "Yu12", "T06", "Yu14", "Yu15", "H04", "Yu17", "Y14", "Yu19", "Yu20", "Yu21", "Yu22", "Yu23", "Yu24"]
  },
  {
    id: "namboku", name: "Namboku Line", nameJp: "南北線", color: "#00A676", isLoop: false, tripMinutes: 40, trainIntervalMinutes: 5,
    stations: ["Y22", "N02", "N03", "N04", "N05", "G06", "H04", "M12", "Yu14", "T06", "M22", "N12", "N13", "Y04", "N15", "N16", "N17", "N18", "N19"]
  },
  {
    id: "fukutoshin", name: "Fukutoshin Line", nameJp: "副都心線", color: "#9C5E31", isLoop: false, tripMinutes: 35, trainIntervalMinutes: 4,
    stations: ["Yu01", "Yu02", "Yu03", "Yu04", "Yu05", "Yu06", "Yu07", "Yu08", "Y01", "F10", "F11", "F12", "M09", "F14", "C03", "Y24"]
  }
];

// Data for zoomed-in background text of Ward names
const WARD_LABELS = [
  { nameJp: "新宿区", nameEn: "Shinjuku", x: 300, y: 360 },
  { nameJp: "渋谷区", nameEn: "Shibuya", x: 195, y: 550 },
  { nameJp: "港区", nameEn: "Minato", x: 525, y: 620 },
  { nameJp: "千代田区", nameEn: "Chiyoda", x: 550, y: 550 },
  { nameJp: "中央区", nameEn: "Chuo", x: 687, y: 512 },
  { nameJp: "文京区", nameEn: "Bunkyo", x: 500, y: 375 },
  { nameJp: "台東区", nameEn: "Taito", x: 700, y: 325 },
  { nameJp: "墨田区", nameEn: "Sumida", x: 812, y: 325 },
  { nameJp: "江東区", nameEn: "Koto", x: 865, y: 597 },
  { nameJp: "品川区", nameEn: "Shinagawa", x: 400, y: 726 },
  { nameJp: "目黒区", nameEn: "Meguro", x: 182, y: 695 },
  { nameJp: "豊島区", nameEn: "Toshima", x: 325, y: 212 },
  { nameJp: "中野区", nameEn: "Nakano", x: 95, y: 230 },
  { nameJp: "杉並区", nameEn: "Suginami", x: 45, y: 375 },
  { nameJp: "練馬区", nameEn: "Nerima", x: 143, y: 123 },
  { nameJp: "板橋区", nameEn: "Itabashi", x: 233, y: 61 },
  { nameJp: "北区", nameEn: "Kita", x: 400, y: 80 },
  { nameJp: "荒川区", nameEn: "Arakawa", x: 600, y: 216 },
  { nameJp: "足立区", nameEn: "Adachi", x: 720, y: 95 },
  { nameJp: "葛飾区", nameEn: "Katsushika", x: 907, y: 123 },
  { nameJp: "江戸川区", nameEn: "Edogawa", x: 912, y: 425 },
  { nameJp: "大田区", nameEn: "Ota", x: 362, y: 770 },
  { nameJp: "世田谷区", nameEn: "Setagaya", x: 75, y: 550 }
];

// --- Musical Setup ---
const LINE_NOTES = {
  fukutoshin: 48, chiyoda: 55, yurakucho: 57, yamanote: 60, marunouchi: 62, 
  ginza: 64, chuo: 67, hanzomon: 69, tozai: 72, hibiya: 74, namboku: 79
};

function getSyllables(name) {
  const syllables = [];
  const regex = /([bcdfghjklmnpqrstvwxyz]*)([aeiou])/ig;
  let match;
  while ((match = regex.exec(name)) !== null) {
    syllables.push({
      consonant: match[1].toLowerCase(),
      vowel: match[2].toLowerCase(),
      text: match[0],
      index: match.index
    });
  }
  return syllables;
}

function getNoteFrequency(baseMidiNote, consonant, vowel) {
  const vowelOffsets = { 'a': 0, 'i': 2, 'u': 4, 'e': 7, 'o': 9 };
  let octaveOffset = 0;
  if (/[kghfbp]/.test(consonant)) octaveOffset = 1;
  if (/[szjcyw]/.test(consonant)) octaveOffset = 2;
  if (/[tdrl]/.test(consonant)) octaveOffset = -1;
  
  const noteOffset = vowelOffsets[vowel] || 0;
  const finalMidi = baseMidiNote + (octaveOffset * 12) + noteOffset;
  return 440 * Math.pow(2, (finalMidi - 69) / 12);
}

// --- Audio Assets for "Voice/Acapella" Mode ---
const VOICE_FILES = {
  doors: "/audio/metro-doors.m4a",   
  passing: "/audio/metro-passing.m4a", 
  accel: "/audio/metro-accel.m4a",   
  decel: "/audio/metro-decel.m4a",   
  moving: "/audio/metro-running.m4a"   
};

// Mathematical Timetable Generator
function createSchedule(stationIds, tripMinutes, stopSeconds, stationsDict) {
  let totalDist = 0;
  const segments = [];
  for (let i = 0; i < stationIds.length - 1; i++) {
    const s1 = stationsDict[stationIds[i]];
    const s2 = stationsDict[stationIds[i + 1]];
    const dx = s2.x - s1.x;
    const dy = s2.y - s1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    segments.push(dist);
    totalDist += dist;
  }

  const totalTripSeconds = tripMinutes * 60;
  const totalMovingSeconds = totalTripSeconds - (stationIds.length * stopSeconds);
  
  const schedule = [];
  let currentTime = 0;
  for (let i = 0; i < stationIds.length; i++) {
    const arr = currentTime;
    const dep = currentTime + stopSeconds;
    schedule.push({ stationId: stationIds[i], arrival: arr, departure: dep });
    currentTime = dep;
    if (i < stationIds.length - 1) {
      const segmentTime = (segments[i] / totalDist) * totalMovingSeconds;
      currentTime += segmentTime;
    }
  }
  return schedule;
}

const SCHEDULES = (() => {
  const s = {};
  const STOP_SECONDS = 40; 
  
  LINES.forEach(line => {
    const fwdSched = createSchedule(line.stations, line.tripMinutes, STOP_SECONDS, STATIONS);
    const bwdSched = createSchedule([...line.stations].reverse(), line.tripMinutes, STOP_SECONDS, STATIONS);

    // Helper to generate departures with morning start staggers and organic variations (±10 to ±45 seconds)
    const generateDepartures = () => {
      const departures = [];
      // Stagger the first train of the day by a random amount (-60 to +120 seconds)
      const startStagger = Math.floor(Math.random() * 180) - 60;
      let t = 5 * 3600 + startStagger; 
      const endTime = 25.5 * 3600; // Last train around 1:30 AM the next day
      
      while (t < endTime) {
         // Add a randomized delay to individual train departures (±10 to ±45 seconds)
         const randomDelay = (Math.random() < 0.5 ? -1 : 1) * (10 + Math.floor(Math.random() * 35));
         departures.push(t + randomDelay);
         
         const hour = t / 3600;
         let multiplier = 1;
         if (hour < 7.5) multiplier = 1.5; // Early Morning
         else if (hour < 9.5) multiplier = 0.8; // Morning Rush Hour!
         else if (hour < 17) multiplier = 1.5; // Mid-day
         else if (hour < 20) multiplier = 1.0; // Evening Rush
         else if (hour < 23) multiplier = 1.5; // Night
         else multiplier = 2.5; // Late Night
         
         t += line.trainIntervalMinutes * multiplier * 60;
      }
      return departures;
    };

    // Stagger fwd and bwd directions differently to break mirroring
    s[`${line.id}_fwd`] = { schedule: fwdSched, departures: generateDepartures() };
    s[`${line.id}_bwd`] = { schedule: bwdSched, departures: generateDepartures() };
  });
  return s;
})();

function getActiveTrains(timeOfDaySeconds, schedule, departures) {
  const trains = [];
  const totalDuration = schedule[schedule.length - 1].departure;
  
  for (const depTime of departures) {
    let t_local = timeOfDaySeconds - depTime;
    
    // Handle midnight wrap-around cleanly (if viewing at 00:30, check for trains that departed at 24:30)
    if (t_local < 0) t_local += 86400; 
    
    if (t_local >= 0 && t_local <= totalDuration) {
      trains.push({ localTime: t_local, startTime: depTime });
    }
  }
  return trains;
}

function getTrainPosition(t_local, schedule, stationsDict) {
  if (t_local <= schedule[0].departure) {
    const p1 = stationsDict[schedule[0].stationId];
    const p2 = stationsDict[schedule[1].stationId];
    return { x: p1.x, y: p1.y, angle: Math.atan2(p2.y - p1.y, p2.x - p1.x) };
  }
  if (t_local >= schedule[schedule.length - 1].arrival) {
    const p1 = stationsDict[schedule[schedule.length - 2].stationId];
    const p2 = stationsDict[schedule[schedule.length - 1].stationId];
    return { x: p2.x, y: p2.y, angle: Math.atan2(p2.y - p1.y, p2.x - p1.x) };
  }
  
  for (let i = 0; i < schedule.length - 1; i++) {
    const current = schedule[i];
    const next = schedule[i + 1];
    
    if (t_local >= current.arrival && t_local < next.arrival) {
      const p1 = stationsDict[current.stationId];
      const p2 = stationsDict[next.stationId];
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      
      if (t_local <= current.departure) {
        return { x: p1.x, y: p1.y, angle };
      } else {
        let f = (t_local - current.departure) / (next.arrival - current.departure);
        f = (1 - Math.cos(Math.PI * f)) / 2; // Easing function for smooth accel/decel
        return { 
          x: p1.x + f * (p2.x - p1.x), 
          y: p1.y + f * (p2.y - p1.y),
          angle 
        };
      }
    }
  }
  return null;
}

function getTrainStateInfo(t_local, schedule) {
  if (t_local <= schedule[0].departure) return { state: 'STOPPED', stationId: schedule[0].stationId };
  if (t_local >= schedule[schedule.length - 1].arrival) return { state: 'STOPPED', stationId: schedule[schedule.length - 1].stationId };

  for (let i = 0; i < schedule.length - 1; i++) {
    const current = schedule[i];
    const next = schedule[i + 1];

    if (t_local >= current.arrival && t_local <= current.departure) {
      return { state: 'STOPPED', stationId: current.stationId };
    }
    if (t_local > current.departure && t_local < next.arrival) {
      const progress = (t_local - current.departure) / (next.arrival - current.departure);
      if (progress < 0.15) return { state: 'ACCEL', stationId: null };
      if (progress > 0.85) return { state: 'DECEL', stationId: null };
      return { state: 'CRUISE', stationId: null };
    }
  }
  return null;
}

export default function App() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const timeDisplayRef = useRef(null);
  
  const timeMultiplierRef = useRef(1);
  
  const audioCtxRef = useRef(null);
  const audioBuffersRef = useRef({});
  const isAudioEnabledRef = useRef(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const audioModeRef = useRef('chime');
  const [audioMode, setAudioMode] = useState('chime');

  const [activeLines, setActiveLinesState] = useState(() => 
    LINES.reduce((acc, l) => ({ ...acc, [l.id]: true }), {})
  );
  const activeLinesRef = useRef(activeLines);

  const pingedStopsRef = useRef(new Set());
  const trainStatesRef = useRef({});
  const passingPairRef = useRef(new Set());
  const visualPingsRef = useRef([]);

  // Station name display tracking refs
  const stationArrivalsRef = useRef(new Map());
  const stationMelodiesRef = useRef(new Map());

  // Pan and Zoom State
  const transformRef = useRef({ scale: 1, x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(0);
  const hoveredStationRef = useRef(null); // Track currently hovered station

  const getInternalCoords = (e) => {
    const container = containerRef.current;
    if (!container) return null;

    const { width, height, left, top } = container.getBoundingClientRect();
    const clickX = e.clientX - left;
    const clickY = e.clientY - top;

    const baseW = 1100, baseH = 850;
    const baseScale = Math.min(width / baseW, height / baseH);
    const offsetX = (width - 1000 * baseScale) / 2;
    const offsetY = (height - 800 * baseScale) / 2;

    const userPanX = transformRef.current.x;
    const userPanY = transformRef.current.y;
    const userScale = transformRef.current.scale;

    const adjustedX = clickX - offsetX - userPanX;
    const adjustedY = clickY - offsetY - userPanY;

    return {
      x: adjustedX / (baseScale * userScale),
      y: adjustedY / (baseScale * userScale)
    };
  };

  const distToSegmentSquared = (p, v, w) => {
    const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
    if (l2 === 0) return (p.x - v.x)**2 + (p.y - v.y)**2;
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return (p.x - (v.x + t * (w.x - v.x)))**2 + (p.y - (v.y + t * (w.y - v.y)))**2;
  };

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = { 
      x: e.clientX - transformRef.current.x, 
      y: e.clientY - transformRef.current.y 
    };
    dragMovedRef.current = 0;
    
    if (e.target.setPointerCapture) {
       e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (isDraggingRef.current) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      
      dragMovedRef.current += Math.abs(newX - transformRef.current.x) + Math.abs(newY - transformRef.current.y);
      
      transformRef.current.x = newX;
      transformRef.current.y = newY;
      hoveredStationRef.current = null; // Clear hover state while dragging
      
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    } else {
      const coords = getInternalCoords(e);
      if (!coords) return;

      let isHovering = false;
      let hoveredSt = null;
      const hitDist = 15 / transformRef.current.scale;
      
      for (const st of Object.values(STATIONS)) {
        const dx = st.x - coords.x;
        const dy = st.y - coords.y;
        if (Math.sqrt(dx * dx + dy * dy) < hitDist) {
          isHovering = true;
          hoveredSt = st;
          break;
        }
      }

      hoveredStationRef.current = hoveredSt;

      if (!isHovering) {
        const lineHitSq = 100 / (transformRef.current.scale * transformRef.current.scale);
        for (const line of LINES) {
          for (let i = 0; i < line.stations.length - 1; i++) {
            const s1 = STATIONS[line.stations[i]];
            const s2 = STATIONS[line.stations[i+1]];
            if (s1 && s2 && distToSegmentSquared(coords, s1, s2) < lineHitSq) {
              isHovering = true;
              break;
            }
          }
          if (isHovering) break;
        }
      }
      
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isHovering ? 'pointer' : 'grab';
      }
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    if (e.target.releasePointerCapture) {
       e.target.releasePointerCapture(e.pointerId);
    }
    
    if (dragMovedRef.current < 5) {
      handleClick(e);
    }
    
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  };

  const handleClick = (e) => {
    const coords = getInternalCoords(e);
    if (!coords) return;

    let clickedStation = null;
    let minDist = 15 / transformRef.current.scale;

    Object.values(STATIONS).forEach(st => {
      const dx = st.x - coords.x;
      const dy = st.y - coords.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        clickedStation = st;
      }
    });

    if (clickedStation) {
      const linesAtStation = LINES.filter(l => l.stations.includes(clickedStation.id));
      if (linesAtStation.length > 0) {
        const nextState = { ...activeLinesRef.current };
        const anyActive = linesAtStation.some(l => nextState[l.id]);
        
        linesAtStation.forEach(l => {
          nextState[l.id] = !anyActive;
        });
        
        activeLinesRef.current = nextState;
        setActiveLinesState(nextState);
        
        visualPingsRef.current.push({
          x: clickedStation.x,
          y: clickedStation.y,
          color: linesAtStation[0].color,
          start: performance.now()
        });
      }
      return;
    }

    let clickedLine = null;
    let minLineDistSq = 100 / (transformRef.current.scale * transformRef.current.scale);

    for (const line of LINES) {
      for (let i = 0; i < line.stations.length - 1; i++) {
        const s1 = STATIONS[line.stations[i]];
        const s2 = STATIONS[line.stations[i+1]];
        if (!s1 || !s2) continue;
        const distSq = distToSegmentSquared(coords, s1, s2);
        if (distSq < minLineDistSq) {
          minLineDistSq = distSq;
          clickedLine = line;
        }
      }
    }

    if (clickedLine) {
      toggleLine(clickedLine.id);
      visualPingsRef.current.push({
        x: coords.x,
        y: coords.y,
        color: clickedLine.color,
        start: performance.now()
      });
    }
  };

  const handleWheel = (e) => {
    const scaleAdj = e.deltaY > 0 ? 0.85 : 1.15;
    let newScale = transformRef.current.scale * scaleAdj;
    newScale = Math.max(0.5, Math.min(newScale, 8)); // Allow deep zoom

    const container = containerRef.current;
    if (!container) return;
    
    const { left, top, width, height } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const baseW = 1100, baseH = 850;
    const baseScale = Math.min(width / baseW, height / baseH);
    const offsetX = (width - 1000 * baseScale) / 2;
    const offsetY = (height - 800 * baseScale) / 2;

    const relativeX = mouseX - offsetX;
    const relativeY = mouseY - offsetY;

    transformRef.current.x = relativeX - (relativeX - transformRef.current.x) * (newScale / transformRef.current.scale);
    transformRef.current.y = relativeY - (relativeY - transformRef.current.y) * (newScale / transformRef.current.scale);
    transformRef.current.scale = newScale;
  };

  const zoomTo = (factor) => {
    let newScale = transformRef.current.scale * factor;
    newScale = Math.max(0.5, Math.min(newScale, 8));
    
    const container = containerRef.current;
    if (!container) return;
    
    const { width, height } = container.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;

    const baseW = 1100, baseH = 850;
    const baseScale = Math.min(width / baseW, height / baseH);
    const offsetX = (width - 1000 * baseScale) / 2;
    const offsetY = (height - 800 * baseScale) / 2;

    const relativeX = centerX - offsetX;
    const relativeY = centerY - offsetY;

    transformRef.current.x = relativeX - (relativeX - transformRef.current.x) * (newScale / transformRef.current.scale);
    transformRef.current.y = relativeY - (relativeY - transformRef.current.y) * (newScale / transformRef.current.scale);
    transformRef.current.scale = newScale;
  };

  const resetZoom = () => {
    transformRef.current = { scale: 1, x: 0, y: 0 };
  };

  useEffect(() => {
    const loadVoiceBuffers = async (ctx) => {
      for (const [key, url] of Object.entries(VOICE_FILES)) {
        if (audioBuffersRef.current[key]) continue;
        try {
          const res = await fetch(url);
          const arrayBuffer = await res.arrayBuffer();
          audioBuffersRef.current[key] = await ctx.decodeAudioData(arrayBuffer);
        } catch (err) {
          console.error(`Failed to load audio ${key}:`, err);
        }
      }
    };
    if (audioCtxRef.current) {
        loadVoiceBuffers(audioCtxRef.current);
    }
  }, [audioMode]);

  const toggleAudio = () => {
    let ctx = audioCtxRef.current;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      Object.entries(VOICE_FILES).forEach(async ([key, url]) => {
        try {
          const res = await fetch(url);
          const arrayBuffer = await res.arrayBuffer();
          audioBuffersRef.current[key] = await ctx.decodeAudioData(arrayBuffer);
        } catch(e) {}
      });
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    isAudioEnabledRef.current = newState;
  };

  const setMode = (mode) => {
    setAudioMode(mode);
    audioModeRef.current = mode;
  };

  const toggleLine = (lineId) => {
    const next = { ...activeLinesRef.current, [lineId]: !activeLinesRef.current[lineId] };
    activeLinesRef.current = next;
    setActiveLinesState(next);
  };

  const focusLine = (lineId) => {
    const next = {};
    LINES.forEach(l => {
      next[l.id] = (l.id === lineId);
    });
    activeLinesRef.current = next;
    setActiveLinesState(next);
  };

  const selectAllLines = () => {
    const next = {};
    LINES.forEach(l => {
      next[l.id] = true;
    });
    activeLinesRef.current = next;
    setActiveLinesState(next);
  };

  const playChimePing = (lineId, stationId, stationName, stationX, currentTimeMs, delayMs = 0) => {
    const timeMultiplier = timeMultiplierRef.current;
    const speedFactor = Math.max(0.25, 1 / Math.sqrt(timeMultiplier)); 
    const noteDuration = 0.15 * speedFactor;
    const syllables = getSyllables(stationName);
    const delaySeconds = delayMs / 1000;

    // Keep track of the visual melody state to light up syllables
    if (audioModeRef.current === 'chime') {
      stationMelodiesRef.current.set(stationId, {
        syllables,
        startTime: currentTimeMs + delayMs, // Highlight starts exactly when the delayed audio starts
        noteDuration: noteDuration * 1000 // duration in ms
      });
    }

    if (!audioCtxRef.current || !isAudioEnabledRef.current || audioModeRef.current !== 'chime') return;
    
    const ctx = audioCtxRef.current;
    const baseMidi = LINE_NOTES[lineId] || 60;
    
    syllables.forEach((syl, i) => {
      const freq = getNoteFrequency(baseMidi, syl.consonant, syl.vowel);
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
      
      osc.type = 'sine';
      const startTime = ctx.currentTime + delaySeconds + (i * noteDuration);
      osc.frequency.setValueAtTime(freq, startTime); 
      
      if (panner.pan) {
        const panValue = (Math.max(0, Math.min(1000, stationX)) / 1000) * 2 - 1;
        panner.pan.setValueAtTime(panValue, startTime);
      }
      
      gain.gain.setValueAtTime(0, startTime);
      const maxVol = Math.max(0.01, 0.08 - (freq / 5000));
      gain.gain.linearRampToValueAtTime(maxVol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 4);
      
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + noteDuration * 4 + 0.1);
    });
  };

  const playVoiceSound = (soundKey, posX, delayMs = 0) => {
    if (!audioCtxRef.current || !isAudioEnabledRef.current || audioModeRef.current !== 'voice') return;
    const buffer = audioBuffersRef.current[soundKey];
    if (!buffer) return;

    const ctx = audioCtxRef.current;
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    
    const delaySeconds = delayMs / 1000;
    const startTime = ctx.currentTime + delaySeconds;

    if (panner.pan) {
      const panValue = (Math.max(0, Math.min(1000, posX)) / 1000) * 2 - 1;
      panner.pan.setValueAtTime(panValue, startTime);
    }

    let vol = 0.5;
    if (soundKey === 'moving') vol = 0.2;
    if (soundKey === 'passing') vol = 0.6;
    if (soundKey === 'doors') vol = 0.6;
    
    const simSpeed = timeMultiplierRef.current;
    if (simSpeed > 5) vol *= 0.6;
    if (simSpeed >= 60) vol *= 0.3;

    gain.gain.value = vol;

    source.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    source.start(startTime);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    let animationFrameId;
    let lastTime = performance.now();
    let simTime = Date.now() / 1000; 

    const freq = {};
    LINES.forEach(l => l.stations.forEach(s => freq[s] = (freq[s] || 0) + 1));

    const render = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      simTime += dt * timeMultiplierRef.current;

      // Calculate pure Tokyo time mapped to a 24-hour cycle in seconds (0 to 86399)
      const tokyoTimeSeconds = (simTime + 9 * 3600) % 86400;

      // Clean up old station arrivals and melodies
      for (const [sId, t] of stationArrivalsRef.current.entries()) {
        if (time - t > 3000) stationArrivalsRef.current.delete(sId);
      }
      for (const [sId, mel] of stationMelodiesRef.current.entries()) {
        const totalTime = mel.syllables.length * mel.noteDuration;
        if (time - mel.startTime > totalTime + 1000) stationMelodiesRef.current.delete(sId);
      }

      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      if (timeDisplayRef.current) {
        const d = new Date(simTime * 1000);
        timeDisplayRef.current.innerText = d.toLocaleTimeString('en-US', { 
            timeZone: 'Asia/Tokyo', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      
      ctx.fillStyle = "#0f172a"; 
      ctx.fillRect(0, 0, width, height);

      const baseW = 1100, baseH = 850;
      const baseScale = Math.min(width / baseW, height / baseH);
      const offsetX = (width - 1000 * baseScale) / 2;
      const offsetY = (height - 800 * baseScale) / 2;

      // Apply Pan & Zoom transformations
      ctx.translate(offsetX + transformRef.current.x, offsetY + transformRef.current.y);
      ctx.scale(baseScale * transformRef.current.scale, baseScale * transformRef.current.scale);

      // --- Draw Zoomed Ward Labels ---
      const zoomLvl = transformRef.current.scale;
      if (zoomLvl > 1.2) {
        const alpha = Math.min(0.2, (zoomLvl - 1.2) * 0.5); // Fades in smoothly
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        WARD_LABELS.forEach(ward => {
          ctx.fillStyle = "#cbd5e1"; 
          ctx.font = "bold 24px 'M PLUS 1p', sans-serif";
          ctx.fillText(ward.nameJp, ward.x, ward.y - 8);
          
          ctx.font = "bold 12px 'M PLUS 1p', sans-serif";
          ctx.fillText(`${ward.nameEn} Ward`, ward.x, ward.y + 16);
        });
        ctx.restore();
      }

      // Backdrops
      LINES.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        line.stations.forEach((sid, idx) => {
          const st = STATIONS[sid];
          if (idx === 0) ctx.moveTo(st.x, st.y);
          else ctx.lineTo(st.x, st.y);
        });
        ctx.stroke();
      });

      // Colored Lines
      LINES.forEach(line => {
        const isActive = activeLinesRef.current[line.id];
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.globalAlpha = isActive ? 1.0 : 0.2; 
        line.stations.forEach((sid, idx) => {
          const st = STATIONS[sid];
          if (idx === 0) ctx.moveTo(st.x, st.y);
          else ctx.lineTo(st.x, st.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1.0; 
      });

      // Stations
      Object.keys(STATIONS).forEach(sid => {
        const st = STATIONS[sid];
        const isTransfer = freq[sid] > 1;
        
        const isHovered = hoveredStationRef.current?.id === sid;
        const hasArrival = stationArrivalsRef.current.has(sid);
        const hasMelody = stationMelodiesRef.current.has(sid);
        
        ctx.beginPath();
        ctx.arc(st.x, st.y, isTransfer ? 7 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? "#e2e8f0" : "#ffffff";
        ctx.fill();
        ctx.lineWidth = isHovered ? 3.5 : 2.5;
        ctx.strokeStyle = "#0f172a";
        ctx.stroke();

        let arrivalAlpha = 0;
        if (hasArrival) {
          const age = time - stationArrivalsRef.current.get(sid);
          if (age < 2000) arrivalAlpha = 1;
          else arrivalAlpha = Math.max(0, 1 - (age - 2000) / 1000);
        }
        
        let melodyAlpha = 0;
        if (hasMelody) {
          const mel = stationMelodiesRef.current.get(sid);
          const age = time - mel.startTime;
          const totalTime = mel.syllables.length * mel.noteDuration;
          if (age < totalTime) melodyAlpha = 1;
          else melodyAlpha = Math.max(0, 1 - (age - totalTime) / 1000);
        }

        const textAlpha = isHovered ? 1 : Math.max(arrivalAlpha, melodyAlpha);

        if (textAlpha > 0) {
          ctx.save();
          ctx.globalAlpha = textAlpha;

          const offset = st.textOffset || [18, 8];
          const labelScale = Math.max(0.5, 1 / Math.sqrt(zoomLvl));
          
          const needsBg = isHovered || hasArrival || hasMelody;
          
          if (needsBg) {
            // Draw a solid background for pop
            ctx.font = `bold ${13 * labelScale}px 'M PLUS 1p', sans-serif`;
            const textWJp = ctx.measureText(st.nameJp).width;
            ctx.font = `${9 * labelScale}px 'M PLUS 1p', sans-serif`;
            const textWKana = st.nameKana ? ctx.measureText(st.nameKana).width : 0;
            const textWEn = ctx.measureText(st.name).width;
            const maxW = Math.max(textWJp, textWKana, textWEn);
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
            ctx.fillRect(
              st.x + offset[0] * labelScale - 6, 
              st.y + offset[1] * labelScale - (18 * labelScale), 
              maxW + 12, 
              st.nameKana ? (41 * labelScale) : (32 * labelScale)
            );
          } else {
            ctx.shadowColor = "#0f172a";
            ctx.shadowBlur = 6;
          }
          
          const textX = st.x + offset[0] * labelScale;
          const textY_Jp = st.y + offset[1] * labelScale - (4 * labelScale);
          const textY_Kana = st.y + offset[1] * labelScale + (7 * labelScale);
          const textY_En = st.y + offset[1] * labelScale + (needsBg && st.nameKana ? (17 * labelScale) : (8 * labelScale));
          
          // Jp Text
          ctx.fillStyle = "#f8fafc";
          ctx.font = `bold ${13 * labelScale}px 'M PLUS 1p', sans-serif`;
          ctx.fillText(st.nameJp, textX, textY_Jp);
          
          // Kana Text
          if (needsBg && st.nameKana) {
            ctx.fillStyle = "#cbd5e1";
            ctx.font = `${8 * labelScale}px 'M PLUS 1p', sans-serif`;
            ctx.fillText(st.nameKana, textX, textY_Kana);
          }
          
          // Base English Text
          ctx.fillStyle = "#94a3b8";
          ctx.font = `${9 * labelScale}px 'M PLUS 1p', sans-serif`;
          ctx.fillText(st.name, textX, textY_En);
          
          // Karaoke Syllable Highlight (Active Melody)
          if (hasMelody) {
            const mel = stationMelodiesRef.current.get(sid);
            const elapsed = time - mel.startTime;
            const sylIdx = Math.floor(elapsed / mel.noteDuration);
            
            if (sylIdx >= 0 && sylIdx < mel.syllables.length) {
              const activeSyl = mel.syllables[sylIdx];
              
              // 1. English Syllable Highlight
              ctx.save();
              ctx.fillStyle = "#ffffff"; // pure white core
              ctx.shadowColor = "#38bdf8"; // bright glowing cyan
              ctx.shadowBlur = 15; // enlarged bloom
              ctx.font = `${9 * labelScale}px 'M PLUS 1p', sans-serif`;
              
              // Measure text up to the active syllable to align properly
              const beforeW = ctx.measureText(st.name.substring(0, activeSyl.index)).width;
              
              // Draw it twice for extra brightness bloom
              ctx.fillText(activeSyl.text, textX + beforeW, textY_En);
              ctx.fillText(activeSyl.text, textX + beforeW, textY_En);
              ctx.restore();

              // 2. Hiragana Syllable Highlight
              if (needsBg && st.nameKana) {
                ctx.save();
                ctx.fillStyle = "#ffffff";
                ctx.shadowColor = "#38bdf8";
                ctx.shadowBlur = 15;
                ctx.font = `${8 * labelScale}px 'M PLUS 1p', sans-serif`;

                // Calculate proportional chunks of the Kana string to highlight
                const startIndex = Math.round((sylIdx / mel.syllables.length) * st.nameKana.length);
                const endIndex = Math.round(((sylIdx + 1) / mel.syllables.length) * st.nameKana.length);
                const activeKana = st.nameKana.substring(startIndex, endIndex);

                if (activeKana) {
                  const kanaBeforeW = ctx.measureText(st.nameKana.substring(0, startIndex)).width;
                  ctx.fillText(activeKana, textX + kanaBeforeW, textY_Kana);
                  ctx.fillText(activeKana, textX + kanaBeforeW, textY_Kana);
                }
                ctx.restore();
              }
            }
          }
          
          ctx.shadowBlur = 0; 
          ctx.restore();
        }
      });

      // Train Tracking & Audio Triggers
      const activeTrainIds = new Set();
      const currentFrameTrains = [];

      LINES.forEach(line => {
        const isActive = activeLinesRef.current[line.id];
        const fwdData = SCHEDULES[`${line.id}_fwd`];
        const bwdData = SCHEDULES[`${line.id}_bwd`];
        
        const processTrains = (trains, dirId, schedule) => {
          trains.forEach(tr => {
            const trainId = `${line.id}_${dirId}_${tr.startTime}`;
            activeTrainIds.add(trainId);

            const stateInfo = getTrainStateInfo(tr.localTime, schedule);
            const pos = getTrainPosition(tr.localTime, schedule, STATIONS);

            if (pos && stateInfo) {
              const prevState = trainStatesRef.current[trainId];

              if (prevState !== stateInfo.state) {
                if (stateInfo.state === 'STOPPED') {
                  const pingSig = `${trainId}_${stateInfo.stationId}`;
                  if (!pingedStopsRef.current.has(pingSig)) {
                    pingedStopsRef.current.add(pingSig);
                    
                    const st = STATIONS[stateInfo.stationId];
                    
                    if (isActive) {
                      // Show station name on arrival instantly
                      stationArrivalsRef.current.set(stateInfo.stationId, time);
                      
                      // Calculate a realistic delay before playing the audio (0.6 seconds in real time, scaled by fast-forwarding)
                      const delayMs = 600 / timeMultiplierRef.current;
                      
                      if (audioModeRef.current === 'chime') {
                        playChimePing(line.id, stateInfo.stationId, st ? st.name : "", st ? st.x : 500, time, delayMs);
                      } else if (audioModeRef.current === 'voice') {
                        playVoiceSound('doors', st ? st.x : 500, delayMs);
                      }

                      if (st) {
                        visualPingsRef.current.push({
                          x: st.x, y: st.y, color: line.color, start: time
                        });
                      }
                    }
                  }
                } else if (isActive && audioModeRef.current === 'voice') {
                  if (stateInfo.state === 'ACCEL') playVoiceSound('accel', pos.x);
                  else if (stateInfo.state === 'CRUISE') playVoiceSound('moving', pos.x);
                  else if (stateInfo.state === 'DECEL') playVoiceSound('decel', pos.x);
                }
                
                trainStatesRef.current[trainId] = stateInfo.state;
              }

              if (isActive) {
                currentFrameTrains.push({ id: trainId, x: pos.x, y: pos.y, angle: pos.angle });
                drawTrain(ctx, pos, line.color);
              }
            }
          });
        };

        processTrains(getActiveTrains(tokyoTimeSeconds, fwdData.schedule, fwdData.departures), 'fwd', fwdData.schedule);
        processTrains(getActiveTrains(tokyoTimeSeconds, bwdData.schedule, bwdData.departures), 'bwd', bwdData.schedule);
      });

      // Spatial collision check
      const activePairsThisFrame = new Set();
      for (let i = 0; i < currentFrameTrains.length; i++) {
        for (let j = i + 1; j < currentFrameTrains.length; j++) {
          const t1 = currentFrameTrains[i];
          const t2 = currentFrameTrains[j];
          
          const dx = t1.x - t2.x;
          const dy = t1.y - t2.y;
          const distSq = dx*dx + dy*dy;
          
          if (distSq < 150) { 
            const pairId = t1.id < t2.id ? `${t1.id}_${t2.id}` : `${t2.id}_${t1.id}`;
            activePairsThisFrame.add(pairId);
            
            if (!passingPairRef.current.has(pairId)) {
               passingPairRef.current.add(pairId);
               if (audioModeRef.current === 'voice') {
                  playVoiceSound('passing', (t1.x + t2.x) / 2);
               }
            }
          }
        }
      }

      // Memory Cleanup
      for (const sig of pingedStopsRef.current) {
        const tId = sig.split('_').slice(0, 3).join('_');
        if (!activeTrainIds.has(tId)) pingedStopsRef.current.delete(sig);
      }
      for (const tId in trainStatesRef.current) {
        if (!activeTrainIds.has(tId)) delete trainStatesRef.current[tId];
      }
      for (const pairId of passingPairRef.current) {
        if (!activePairsThisFrame.has(pairId)) passingPairRef.current.delete(pairId);
      }

      // Draw Visual Pings
      const PING_DURATION = 800;
      visualPingsRef.current = visualPingsRef.current.filter(ping => {
        const age = time - ping.start;
        if (age > PING_DURATION) return false;
        
        const progress = age / PING_DURATION;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const radius = 5 + (easeOut * 25);
        const opacity = 1 - progress;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = ping.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
        
        return true;
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  function drawTrain(ctx, pos, color) {
    ctx.save();
    
    // Move canvas origin to train position so we can easily rotate around the center
    ctx.translate(pos.x, pos.y);
    
    // Rotate the train to align with the track's angle
    if (pos.angle !== undefined) {
      ctx.rotate(pos.angle);
      
      // If moving towards the left of the screen, flip the train vertically 
      // so it doesn't appear upside down!
      if (Math.abs(pos.angle) > Math.PI / 2) {
        ctx.scale(1, -1);
      }
    }

    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    
    // Reduce train rendering size visually if zoomed in deep
    const scaleModifier = Math.max(0.6, 1 / Math.sqrt(transformRef.current.scale));
    
    // Width matched to existing icon, but shorter height for side profile
    const w = 12 * scaleModifier;
    const h = 7 * scaleModifier;
    const r = 2 * scaleModifier;
    
    // Draw centered on our newly translated origin
    const x = -w / 2;
    const y = -h / 2;

    // Train Body
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 1.5 * scaleModifier;
    ctx.strokeStyle = color;
    ctx.stroke();
    
    ctx.shadowBlur = 0; // Turn off glow for internal details

    // 3 Side Windows
    ctx.fillStyle = color;
    const winW = 2 * scaleModifier;
    const winH = 2.5 * scaleModifier;
    const winY = y + 1.5 * scaleModifier;
    
    ctx.fillRect(x + 1.5 * scaleModifier, winY, winW, winH);
    ctx.fillRect(x + 5 * scaleModifier, winY, winW, winH);
    ctx.fillRect(x + 8.5 * scaleModifier, winY, winW, winH);

    // Wheels (bottom half sticks out of the body)
    ctx.beginPath();
    ctx.arc(x + 3 * scaleModifier, y + h, 1.5 * scaleModifier, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + w - 3 * scaleModifier, y + h, 1.5 * scaleModifier, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-900 text-slate-100 overflow-hidden relative" style={{ fontFamily: "'M PLUS 1p', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@300;400;500;700&display=swap');
        
        @keyframes ringPulse {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        .animate-ring-pulse {
          animation: ringPulse 2.5s cubic-bezier(0.1, 0, 0.2, 1) infinite;
        }
      `}</style>
      <div className="flex-1 w-full relative" ref={containerRef}>
        <canvas 
          ref={canvasRef} 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          className="absolute inset-0 block touch-none cursor-grab" 
        />
        
        {/* Header */}
        <div className="absolute top-6 left-6 p-5 rounded-2xl bg-slate-900/80 pointer-events-none">
          <h1 className="text-2xl font-bold tracking-tight text-white relative w-min">
            {/* Background Circular Pulse centered on the entire title */}
            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-[2.5px] border-white/60 rounded-full animate-ring-pulse pointer-events-none z-0"></div>
            
            {/* Foreground Text Layer */}
            <span className="relative flex flex-col w-min z-10">
              <span className="leading-none mb-1 whitespace-nowrap">メトメロ</span>
              <span className="flex justify-between w-full text-[9px] font-normal text-slate-400 uppercase tracking-normal mt-0.5">
                {"METRONOME".split('').map((char, i) => (
                  <span key={`text-${i}`}>{char}</span>
                ))}
              </span>
            </span>
          </h1>
        </div>

        {/* Top Right Time Display */}
        <div className="absolute top-6 right-6 p-5 rounded-2xl bg-slate-900/80 pointer-events-none flex flex-col items-end">
          <div className="text-2xl font-mono font-bold tracking-tight text-white leading-none mb-1 whitespace-nowrap" ref={timeDisplayRef}>
            00:00:00
          </div>
          <span className="text-[9px] font-normal text-slate-400 uppercase tracking-widest mt-0.5 whitespace-nowrap">
            Tokyo Standard Time
          </span>
        </div>

        {/* Floating Zoom Controls */}
        <div className="absolute bottom-40 right-6 flex flex-col items-center p-1.5 rounded-xl bg-slate-900/80">
          <button onClick={() => zoomTo(1.3)} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-5 h-px bg-slate-700/50 my-1"></div>
          <button onClick={resetZoom} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors text-[9px] uppercase font-bold tracking-widest" title="Reset View">
            FIT
          </button>
          <div className="w-5 h-px bg-slate-700/50 my-1"></div>
          <button onClick={() => zoomTo(0.75)} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Panel */}
        <div className="absolute bottom-6 left-6 p-5 rounded-2xl bg-slate-900/80 pointer-events-auto">
          <div className="flex justify-center mb-3">
            <button 
              onClick={selectAllLines}
              className="text-[9px] text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1.5 rounded transition-colors uppercase tracking-widest font-bold border border-slate-700/50"
              title="Show all lines"
            >
              Show all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {LINES.map(l => {
              const isActive = activeLines[l.id];
              return (
                <button 
                  key={l.id}
                  onClick={() => toggleLine(l.id)}
                  onDoubleClick={() => focusLine(l.id)}
                  className={`flex items-center gap-3 text-sm font-medium transition-all text-left group ${isActive ? 'text-slate-200 hover:text-white' : 'text-slate-600 grayscale opacity-50 hover:opacity-80'}`}
                  title="Double-click to isolate this line"
                >
                  <span className="w-4 h-4 rounded-full border-2 border-slate-900 shadow-sm shrink-0 transition-all group-hover:scale-110" style={{ backgroundColor: l.color }}></span>
                  <div className="flex flex-col">
                    <span>{l.nameJp}</span>
                    <span className={`text-[10px] leading-tight transition-colors ${isActive ? 'text-slate-500' : 'text-slate-700'}`}>{l.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Control Strip */}
        <div className="absolute bottom-6 right-6 p-5 rounded-2xl bg-slate-900/80 pointer-events-auto">
          <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-lg border border-slate-600/50">
            <button 
              onClick={toggleAudio} 
              className={`p-1.5 rounded-md transition-colors ${audioEnabled ? 'bg-slate-700 text-white' : 'hover:bg-slate-700 text-slate-400 hover:text-white'}`}
              title="Toggle Audio"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            {audioEnabled && (
              <>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex bg-slate-900 rounded-md p-1 border border-slate-700/50">
                  <button
                    onClick={() => setMode('chime')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold rounded transition-colors ${audioMode === 'chime' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Music className="w-3 h-3" /> メロディ
                  </button>
                  <button
                    onClick={() => setMode('voice')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold rounded transition-colors ${audioMode === 'voice' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Mic className="w-3 h-3" /> オノマトペ
                  </button>
                </div>
              </>
            )}

            <div className="w-px h-4 bg-slate-600"></div>
            
            <FastForward className="w-4 h-4 text-slate-400 ml-1" />
            <select 
              className="bg-transparent text-white text-sm outline-none font-medium pr-2 cursor-pointer"
              defaultValue={1}
              onChange={e => { timeMultiplierRef.current = Number(e.target.value); }}
            >
              <option value={1} className="bg-slate-800">1x</option>
              <option value={5} className="bg-slate-800">5x</option>
              <option value={10} className="bg-slate-800">10x</option>
              <option value={60} className="bg-slate-800">60x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
