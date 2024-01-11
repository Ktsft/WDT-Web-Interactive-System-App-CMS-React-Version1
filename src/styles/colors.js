export const colors = {
    primary: {
      red: "#C8102E",
      dark: "#1f2630",
      white: "#FFFFFF",
      navy: "#232e3c",
      gray: "#D9D9D6",
      transparentColor: function (color = "", opacity = 1.0) {
        if (color.includes("#")) {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
          return result
            ? `rgba(${parseInt(result[1], 16)},${parseInt(
                result[2],
                16
              )},${parseInt(result[3], 16)},${opacity})`
            : null;
        } else {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
            this[color]
          );
          return result
            ? `rgba(${parseInt(result[1], 16)},${parseInt(
                result[2],
                16
              )},${parseInt(result[3], 16)},${opacity})`
            : null;
        }
      },
    },
    secondary: {
      navy: "#1f2630",
      gray: "#98A4AE",
      dark: "#232e3c",
      blue: "#009ACE",
    },
  };
  
  