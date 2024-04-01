class Style {

    public colors: {
        bold: {
            color_blue_black: string;
            color_blue_sidebar: string;
            color_blue_navbar: string;
            color_black: string;
            color_blue_purple: string;
        },
        grey_white: {
            color_white: string;
            color_grey_background_bold: string;
            color_grey_background_light: string;
            color_grey_buttons: string;
            color_grey_letters_light: string;
            color_grey__to_black_light: string;
            color_grey_middle: string;
        }
    };
    public font_family: string;
    public font_family_resource_url: string;
    public logo: {
        adorithm: string;
        control_panel: string;
    };

    constructor() {
        this.colors = {
            bold: {
                color_blue_black: '#02133E',
                color_blue_sidebar: '#02133E',
                color_blue_navbar: '#506FDE',
                color_black: '#000',
                color_blue_purple: '#434183',
            },
            grey_white: {
                color_white: '#fff',
                color_grey_background_bold: '#D9D9D9',
                color_grey_background_light: '#EDEDED',
                color_grey_buttons: '#808080',
                color_grey_letters_light: '#9C9C9C',
                color_grey__to_black_light: '#595959',
                color_grey_middle: '#ccc',
            }
        };
        this.font_family = 'ABeeZee';
        this.font_family_resource_url = 'https://fonts.googleapis.com/css?family=ABeeZee';
        this.logo = {
            adorithm: 'https://adorithm.com/assets/logo/logo.png',
            control_panel: 'https://adorithm.com/assets/apps/bizyhive/ecommerce-control-panel/logo.png',
        };
    }

}


const style = new Style();
export { style };
