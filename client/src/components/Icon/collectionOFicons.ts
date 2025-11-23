import * as IconsIO5 from "react-icons/io5";
import * as IconsFI from "react-icons/fi";

export default function collectionOFicons(iconName: string) {
  const iconLibraries: any = {
    io5: IconsIO5,
    fi: IconsFI,
  };

  const [libKey, iconKey] = iconName.split(":");
  const library = iconLibraries[libKey];
  const IconComponent = library?.[iconKey];
  return IconComponent;
}
