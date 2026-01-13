import { Open_Sans, Instrument_Sans, Inter } from "next/font/google";

export const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const instrumental_sans = Instrument_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const inter = Inter({
  weight: ["100", '200', "300", "400", "500", "600", "700", "800", '900'],
  subsets: ["latin"],
});
