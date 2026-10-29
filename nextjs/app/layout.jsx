import "@fontsource-variable/inter";
import "./globals.css";


export const metadata = {
  title: { default: "Who is speaking?", template: "%s · Who is speaking?" },
  description: "Where the chatbot assistant came from: talk to ELIZA, give GPT-2 its first assistant script, learn how to build a bot, and read a short history of the chatbot.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#2a2225",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
