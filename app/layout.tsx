import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import Nav from "./components/Nav";
import ThemeRegistry from "./utilities/ThemeRegistry";
import ModalWrapper from "./components/Modals/ModalWrapper";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body>
          <ThemeRegistry options={{ key: "mui-theme" }}>
            <ModalWrapper>
              <Nav />
              {children}
            </ModalWrapper>
          </ThemeRegistry>
        </body>
      </html>
    </StoreProvider>
  );
}
