import { app, BrowserWindow, Menu } from "electron";

export function buildMenu(win: BrowserWindow) {
  const { items } = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => {
            return win.webContents.send(
              "bot-message",
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
