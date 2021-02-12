/********************************************
 *                                          *
 *          REPÚBLICA MÓVIL WIDGET          *
 *                                          *
 *        v1.1.2 - made by jchicano         *
 *                                          *
 ********************************************

Feel free to contact me on GitHub,
if you have any questions or issues.
GitHub Repo:
https://github.com/jchicano/scriptable-republicamovil

/* ============ CONFIG  START ============ */

/*******************************************/
/*                                         */
/*        API ADDRESS AND FILE PATH        */
/*                                         */
/*******************************************/

const IP = '10.0.0.2:8080';
const PATH = '/api-republicamovil/data.json';
const API_URL = 'http://' + IP + PATH;

/*******************************************/
/*                                         */
/*         CHECK FOR SCRIPT UDPATE         */
/*                                         */
/*******************************************/

// Check for script updates and get notified
// as soon as a new version is released
// true = check for script updates
// false = don't check for updates
const CHECK_FOR_SCRIPT_UPDATE = true;

// Flag to check it
let UPDATE_AVAILABLE = false;

/*******************************************/
/*                                         */
/*         CONFIGURE LOOK AND FEEL         */
/*                                         */
/*         NOTE ON DYNAMIC COLORS:         */
/*  the first value is used in iOS light   */
/*   mode, second value will be used in    */
/*                dark mode                */
/*                                         */
/*   Values are hexadecimal color values   */
/*            Visit sites like             */
/*       https://htmlcolorcodes.com        */
/*      to find hex values for colors      */
/*                                         */
/*******************************************/

// Initialization of variables, DO NOT edit
let data,
    // api_online,
    lastFetchDate = false;

// Set the background color of your widget
// const CONF_BG_COLOR = Color.dynamic(new Color('#fefefe'), new Color('#2c2c2e'));
const CONF_BG_COLOR = Color.dynamic(new Color('#f2f2f7'), new Color('#1c1c1e'));

// Configure to use a color gradient instead
// of the single background color (above)
// true = use a color gradient
// - (colors configured below)
// false = use a single color
// - (color configured above)
const CONF_BG_GRADIENT = false;

// gradient color from the top of the widget
const CONF_BG_GRADIENT_COLOR_TOP = Color.dynamic(
    new Color('#fefefe'),
    new Color('#000000')
);
// gradient color to the bottom of the widget
const CONF_BG_GRADIENT_COLOR_BTM = Color.dynamic(
    new Color('#cccccc'),
    new Color('#2c2c2e')
);

/* ============= CONFIG  END ============= */

// check for updates
if (CHECK_FOR_SCRIPT_UPDATE === true) {
    UPDATE_AVAILABLE = await checkForUpdate('v1.1.2');
}

let widget = await createWidget();
if (!config.runsInWidget) {
    await widget.presentSmall();
}

if (CONF_BG_GRADIENT) {
    const gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [CONF_BG_GRADIENT_COLOR_TOP, CONF_BG_GRADIENT_COLOR_BTM];
    widget.backgroundGradient = gradient;
} else {
    widget.backgroundColor = CONF_BG_COLOR;
}

Script.setWidget(widget);
Script.complete();

async function createWidget(items) {
    let fm = FileManager.local();
    let dir = fm.documentsDirectory();
    let jsonLocalPath = fm.joinPath(dir, 'scriptable-republicamovil.json');
    let lastFetchDateLocalPath = fm.joinPath(
        dir,
        'republicamovil-lastupdate.txt'
    );

    const list = new ListWidget();
    // list.addSpacer(16);
    list.addSpacer(8);

    try {
        let req = new Request(API_URL);

        let api_online = false;
        try {
            // Fetch data from api
            data = await req.loadJSON();
            // Write JSON to local file
            fm.writeString(jsonLocalPath, JSON.stringify(data, null, 2));
            api_online = true;
            lastFetchDate = new Date();
            fm.writeString(lastFetchDateLocalPath, lastFetchDate.toString());
        } catch (err) {
            log(err);
            // Read data from local file
            if (
                fm.fileExists(jsonLocalPath) &&
                fm.fileExists(lastFetchDateLocalPath)
            ) {
                data = JSON.parse(fm.readString(jsonLocalPath), null);
                lastFetchDate = new Date(
                    fm.readString(lastFetchDateLocalPath, null)
                );
            } else {
                const errorList = new ListWidget();
                errorList.addText('No local cache');
                return errorList;
            }
        }

        let usedPercentage = -1;
        let total_cel_used =
            data.cel_used_format == 'MB' ? data.cel_used / 1024 : data.cel_used;
        let total_cel_available = data.cel_available;

        // If there is a promotional data plan active
        if (data.promo_used && data.promo_available) {
            let total_promo_used =
                data.promo_used_format == 'MB'
                    ? data.promo_used / 1024
                    : data.promo_used;
            // Update variables
            total_cel_used =
                parseFloat(data.cel_used) + parseFloat(total_promo_used);
            total_cel_available =
                parseInt(data.cel_available) + parseInt(data.promo_available);
            // Set percentage
            usedPercentage = parseInt(
                (total_cel_used / total_cel_available) * 100
            );
        } else {
            // Set percentage
            usedPercentage = parseInt(
                (total_cel_used / total_cel_available) * 100
            );
        }

        let stack = list.addStack();
        let dataIcon = SFSymbol.named('antenna.radiowaves.left.and.right');
        if (UPDATE_AVAILABLE) {
            // log('Script Update available on GitHub');
            dataIcon = SFSymbol.named('exclamationmark.triangle');
        }
        let dataIconElement = stack.addImage(dataIcon.image);
        dataIconElement.imageSize = new Size(15, 15);
        dataIconElement.tintColor = Color.dynamic(Color.black(), Color.white());
        stack.addSpacer(4);
        let titlename = stack.addText('Datos móviles');
        titlename.font = Font.mediumSystemFont(14);
        titlename.textColor = Color.dynamic(Color.black(), Color.white());

        const fontName = 'Futura-Medium';
        const line2 = list.addText(usedPercentage + '%');
        line2.font = new Font(fontName, 36);
        line2.textColor = Color.green();
        if (usedPercentage >= 75) {
            line2.textColor = Color.orange();
        } else if (usedPercentage >= 90) {
            line2.textColor = Color.red();
        }

        let row = list.addStack();
        function addUsedData() {
            let stack = row.addStack();
            stack.layoutHorizontally();
            let line3 = stack.addText(
                parseFloat(data.cel_used) + ' ' + data.cel_used_format
            );
            line3.font = Font.boldSystemFont(14);
            line3.textColor = Color.dynamic(Color.black(), Color.white());
            stack.addSpacer(10);
            const lineSpacer = stack.addText('●');
            lineSpacer.font = Font.heavySystemFont(14);
            lineSpacer.rightAlignText();
            lineSpacer.textColor = Color.green();
            if (usedPercentage >= 75) {
                lineSpacer.textColor = Color.orange();
            } else if (usedPercentage >= 90) {
                lineS.textColor = Color.red();
            }
        }
        addUsedData();
        const line4 = list.addText(
            'de ' + total_cel_available + ' GB consumidos'
        );
        line4.font = Font.mediumSystemFont(10);
        line4.textColor = Color.dynamic(Color.black(), Color.white());
        list.addSpacer(6);

        // list.addSpacer();
        let stack2 = list.addStack();
        stack2.layoutHorizontally();
        stack2.addSpacer();

        dataIcon = SFSymbol.named('phone');
        dataIconElement = stack2.addImage(dataIcon.image);
        dataIconElement.imageSize = new Size(12, 12);
        dataIconElement.tintColor = Color.dynamic(Color.black(), Color.white());
        stack2.addSpacer(4);
        titlename = stack2.addText(
            data.min_used + ' / ' + data.min_available + ' min'
        );
        titlename.font = Font.mediumSystemFont(12);
        titlename.tintColor = Color.dynamic(Color.black(), Color.white());
        stack2.addSpacer();

        list.addSpacer();

        // Add time (and date) of last data fetch
        const df = new DateFormatter();
        const wasFetchedToday = lastFetchDate.getDate() == new Date().getDate();
        df.dateFormat = wasFetchedToday ? 'HH:mm' : 'dd.MM HH:mm';

        list.addSpacer(6);

        // Add time of last widget refresh:
        let stack3 = list.addStack();
        if (api_online) {
            stack3.addSpacer();
            dataIcon = SFSymbol.named('icloud.and.arrow.down');
            dataIconElement = stack3.addImage(dataIcon.image);
            dataIconElement.imageSize = new Size(12, 12);
            dataIconElement.tintColor = Color.dynamic(
                Color.black(),
                Color.white()
            );
            stack3.addSpacer(4);
        } else {
            stack3.layoutHorizontally();
            let titlename = stack3.addText('API Offline');
            titlename.font = Font.boldSystemFont(10);
            titlename.tintColor = Color.dynamic(
                new Color('#101e43'),
                Color.white()
            );
            stack3.addSpacer();
        }

        titlename = stack3.addText(df.string(lastFetchDate));
        if ((wasFetchedToday && api_online) || (wasFetchedToday && !api_online))
            titlename.font = Font.mediumSystemFont(10);
        else titlename.font = Font.mediumSystemFont(8);
        if (api_online && !wasFetchedToday)
            // titlename.font =
            //     api_online && wasFetchedToday
            //         ? Font.mediumSystemFont(10)
            //         : Font.mediumSystemFont(8);
            titlename.tintColor = Color.dynamic(Color.black(), Color.white());
        if (api_online) stack3.addSpacer();

        list.addSpacer(6);
    } catch (err) {
        log(err);
        log('Error fetching JSON');
    }

    return list;
}

/* ============== FUNCTIONS ============== */

// check if there's a script update available on GitHub
async function checkForUpdate(currentVersion) {
    try {
        const latestVersion = await new Request(
            'https://raw.githubusercontent.com/jchicano/scriptable-republicamovil/master/version.txt'
        ).loadString();
        return currentVersion.replace(/[^1-9]+/g, '') <
            latestVersion.replace(/[^1-9]+/g, '')
            ? true
            : false;
    } catch (err) {
        log('try checkForUpdate: ' + err);
        return false;
    }
}
