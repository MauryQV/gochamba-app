/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins_400Regular"],
        poppinsMedium: ["Poppins_500Medium"],
        poppinsBold: ["Poppins_700Bold"],
        poppinsBlack: ["Poppins_900Black"],
        poppinsSemiBold: ["Poppins_600SemiBold"],
        inter: ["Inter_400Regular"],
        interMedium: ["Inter_500Medium"],
        interBold: ["Inter_700Bold"],
        bebasNeue: ["BebasNeue_400Regular"],
      },
    },
  },
  plugins: [],
};
