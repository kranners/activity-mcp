import { BrowserWindow, Menu } from "electron";

export function buildMenu(win: BrowserWindow) {
  const { items } = Menu.buildFromTemplate([
    {
      label: "OAuth",
      submenu: [
        {
          click: () => {
            return win.webContents.send(
              "sendBotEvent",
              "This is a test message!",
            );
          },
          label: "Send test message",
        },
      ],
    },
  ]);

  const menu = Menu.getApplicationMenu();

  if (menu === null) {
    throw new Error("The existing menu was somehow null!");
  }

  items.forEach((item) => menu.append(item));
  Menu.setApplicationMenu(menu);
}
