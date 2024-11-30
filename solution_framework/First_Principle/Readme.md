# FPS code documentation

1. The library running the fps graph is Cytoscape (https://js.cytoscape.org).
2. The backend for this is stored present in `backend` folder and uses express.js
3. The backend is hosted on koyeb.com and stores data in mongodb.

In the event you see a blank white page in the graph, you will need to do the following:
- Open the console using the shortcut Ctrl+shift+I or right click somewhere on the screen outside the graph and select "inspect" from the menu. If you don't see any colourful blocks of text, then you will have to click on "Console" in the panel that opens.
- There should be a block of red text as below:
- Copy the text inside the first set of backticks (this character: `).
- Go to Mongodb, navigate to your database's collections. Choose "edges" and in the filter input type this:`{"data.id":{"$eq":"<paste-text-here>"}}`. Replace `<paste-text-here>` with the text you copied from the red block of text. Hit enter or click on "Apply" button.
- Only one card should show up in the list below the filters. Hovering over it should reveal a dustbin button. Click it. It should reveal two new buttons "Cancel" and "Delete" below the card. Click the "delete" button to confirm deletion.
- Now go back to the page and refresh. It should be fixed. If you're still seeing the red text and the graph is still white, repeat the above steps.

You may also refer to the troubleshooting video in this folder to view the troubleshooting steps.

As a last resort you could also navigate to the backend folder, open powershell or command prompt in that folder using shift + right-click and selecting "Open powershell window here" or "Open command prompt here". If these options aren't visible, refer to this link to troubleshoot: https://www.partitionwizard.com/clone-disk/windows-open-powershell-in-a-folder.html. Once you have a powershell window in the backend folder, type `node init.js` and press `Enter`. **Note: You will need to have nodejs installed for this operation. You may installit from https://nodejs.org if you don't have it already.** 