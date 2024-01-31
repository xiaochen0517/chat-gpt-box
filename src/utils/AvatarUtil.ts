import type {IAvatarProps} from "vue3-avataaars";

export class AvatarUtil {

  public static initDefaultAvatar(optionalAvatar: Partial<IAvatarProps>): IAvatarProps {
    return {
      isCircle: false,
      circleColor: "#00000000",
      hairColor: "#1a1818",
      skinColor: "#d5b0b0",
      clothesColor: "#1e1e1e",
      topColor: "#1152a8",
      facialHairColor: "#232020",
      clothes: "BlazerShirt",
      graphicShirt: "Bat",
      top: "ShortHairShortFlat",
      accessories: "Blank",
      facialHair: "Blank",
      eyes: "Default",
      eyebrows: "Default",
      mouth: "Default",
      ...optionalAvatar,
    };
  }

  public static getDefaultAvatar(): IAvatarProps {
    return this.initDefaultAvatar({});
  }
}