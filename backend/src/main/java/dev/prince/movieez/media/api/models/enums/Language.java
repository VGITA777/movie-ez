package dev.prince.movieez.media.api.models.enums;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;
import org.jspecify.annotations.Nullable;

@Getter
public enum Language {
  ABKHAZIAN("ab"),
  AFAR("aa"),
  AFRIKAANS("af"),
  AKAN("ak"),
  ALBANIAN("sq"),
  AMHARIC("am"),
  ARABIC("ar"),
  ARAGONESE("an"),
  ARMENIAN("hy"),
  AVARIC("av"),
  AVESTAN("ae"),
  AYmARA("ay"),
  AZERBAIJANI("az"),
  BASHKIR("ba"),
  BASQUE("eu"),
  BELARUSIAN("be"),
  BENGALI("bn"),
  BIShLAMA("bi"),
  BOSNIAN("bs"),
  BRETON("br"),
  BULGARIAN("bg"),
  BURMESE("my"),
  CANTONESE("cn"),
  CATALAN("ca"),
  CHAMORRO("ch"),
  CHECHEN("ce"),
  CHICHEWA_NYANJA("ny"),
  CHUVASH("cv"),
  CORSICAN("co"),
  CREE("cr"),
  CROATIAN("hr"),
  CZECH("cs"),
  DANESE("da"),
  DIVEHI("dv"),
  DUTCH("nl"),
  DZONGKHA("dz"),
  ENGLISH("en"),
  ESPERANTO("eo"),
  ESTONIAN("et"),
  EWE("ee"),
  FAROESE("fo"),
  FIJIAN("fj"),
  FINNISH("fi"),
  FRENCH("fr"),
  FRIISIAN("fy"),
  FULAH("ff"),
  GAELIC("gd"),
  GALICIAN("gl"),
  GANDA("lg"),
  GEORGIAN("ka"),
  GERMAN("de"),
  GREEK("el"),
  GUARANI("gn"),
  GUJARATI("gu"),
  HAITIAN("ht"),
  HAUSA("ha"),
  HEBREW("he"),
  HERERO("hz"),
  HINDI("hi"),
  HIRI_MOTU("ho"),
  HUNGARIAN("hu"),
  ICELANDIC("is"),
  IDO("io"),
  IGBO("ig"),
  INDONESIAN("id"),
  INTERLINGUA("ia"),
  INTERLINGUE("ie"),
  INUKTITUT("iu"),
  INUPIAQ("ik"),
  IRISH("ga"),
  ITALIAN("it"),
  JAPANESE("ja"),
  JAVANESE("jv"),
  KALAALLISUT("kl"),
  KANNADA("kn"),
  KANURI("kr"),
  KASHMIRI("ks"),
  KAZAKH("kk"),
  KHMER("km"),
  KIKUYU("ki"),
  KINYARWANDA("rw"),
  KIRGHIZ("ky"),
  KOMI("kv"),
  KONGO("kg"),
  KOREAN("ko"),
  KUANYAMA("kj"),
  KURDISH("ku"),
  LAO("lo"),
  LATIN("la"),
  LATVIAN("lv"),
  LETZEBURGESCH("lb"),
  LIMBURGISH("li"),
  LINGALA("ln"),
  LITHUANIAN("lt"),
  LUBA_KATANGA("lu"),
  MACEDONIAN("mk"),
  MALAGASY("mg"),
  MALAY("ms"),
  MALAYALAM("ml"),
  MALTESE("mt"),
  MANX("gv"),
  MAORI("mi"),
  MARATHI("mr"),
  MARSHALL("mh"),
  MOLDAVIAN("mo"),
  MONGOLIAN("mn"),
  NAURU("na"),
  NAVAJO("nv"),
  NDEBELE("nr"),
  NDONGA("ng"),
  NEPALI("ne"),
  NORWEGIAN("no"),
  NORWEGIAN_BOKMAL("nb"),
  NORWEGIAN_NYNORSK("nn"),
  NORTHERN_SAMI("se"),
  OCCITAN("oc"),
  OJIBWA("oj"),
  ORIYA("or"),
  OROMO("om"),
  OSSETIAN("os"),
  PALI("pi"),
  PERSIAN("fa"),
  POLISH("pl"),
  PORTUGUESE("pt"),
  PUSHTO("ps"),
  QUECHUA("qu"),
  RAETO_ROMANCE("rm"),
  ROMANIAN("ro"),
  RUSSIAN("ru"),
  RUNDI("rn"),
  SAMOAN("sm"),
  SANGO("sg"),
  SANSKRIT("sa"),
  SARDINIAN("sc"),
  SERBIAN("sr"),
  SERBO_CROATIAN("sh"),
  SESOTHO("st"),
  SHONA("sn"),
  SINDHI("sd"),
  SINHALESE("si"),
  SLOVAK("sk"),
  SLOVENIAN("sl"),
  SOMALI("so"),
  SOUTH_NDEBELE("nd"),
  SPANISH("es"),
  SUNDANESE("su"),
  SWAHILI("sw"),
  SWATI("ss"),
  SWEDISH("sv"),
  TAGALOG("tl"),
  TAHITIAN("ty"),
  TAJIK("tg"),
  TAMIL("ta"),
  TATAR("tt"),
  TELUGU("te"),
  THAI("th"),
  TIGRINYA("ti"),
  TONGA("to"),
  TSWANA("tn"),
  TSONGA("ts"),
  TWI("tw"),
  TURKISH("tr"),
  TURKMEN("tk"),
  UIGHUR("ug"),
  UKRAINIAN("uk"),
  URDU("ur"),
  UZBEK("uz"),
  VENDA("ve"),
  VIETNAMESE("vi"),
  VOLAPUK("vo"),
  WALLON("wa"),
  WELSH("cy"),
  WOLOF("wo"),
  XHOSA("xh"),
  YI("ii"),
  YIDDISH("yi"),
  YORUBA("yo"),
  ZHUANG("za"),
  ZULU("zu"),
  MANDARIN("zh"),
  NO_LANGUAGE("xx");

  public static final Map<String, Language> ISO_TO_LANGUAGE_MAP = Arrays
      .stream(Language.values())
      .collect(Collectors.toMap(Language::getIsoCode, language -> language));

  private final String isoCode;

  Language(String isoCode) {
    this.isoCode = isoCode;
  }

  public static Language fromValue(String value) {
    var language = convertToLanguage(value);

    if (language != null) {
      return language;
    }

    try {
      return Language.valueOf(value.toUpperCase());
    } catch (Exception e) {
      throw new IllegalArgumentException("Invalid language: " + value);
    }
  }

  public static Language fromValue(String value, Language defaultLanguage) {

    var language = convertToLanguage(value);

    if (language != null) {
      return language;
    }

    try {
      return Language.valueOf(value.toUpperCase());
    } catch (Exception e) {
      return defaultLanguage;
    }
  }

  @Nullable
  private static Language convertToLanguage(@Nullable String language) {
    if (language == null) {
      return Language.NO_LANGUAGE;
    }

    if (language.length() == 2) {
      return fromIsoCode(language);
    }

    return null;
  }

  public static Language fromIsoCode(String isoCode) {
    return ISO_TO_LANGUAGE_MAP.getOrDefault(isoCode.toLowerCase(), Language.ENGLISH);
  }

}