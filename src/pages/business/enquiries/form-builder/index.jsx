import { useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { useTrialHeight } from "../../../../app/providers/trial-height-provider";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

const setSurveyThemeColors = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary", "#FF5733");    // Primary color
    root.style.setProperty("--secondary", "#33C3FF");  // Secondary color
};

const defaultCreatorOptions = {
    autoSaveEnabled: true,
    collapseOnDrag: true,
    showLogicTab: false,
    showThemeTab: true,
};

const FormBuilder = () => {
    const { trialHeight } = useTrialHeight();
    let [creator, setCreator] = useState(null);
    if (!creator) {
        setSurveyThemeColors();
        creator = new SurveyCreator(defaultCreatorOptions);

        creator.toolbox.removeItem("imagepicker");
        creator.toolbox.removeItem("matrix");
        creator.toolbox.removeItem("dynamicmatrix");
        creator.toolbox.removeItem("matrixdynamic");
        creator.toolbox.removeItem("matrixdropdown");
        creator.toolbox.removeItem("rating");
        creator.toolbox.removeItem("image");
        creator.toolbox.removeItem("expression");
        creator.toolbox.removeItem("html");
        creator.toolbox.removeItem("panel");
        creator.toolbox.removeItem("paneldynamic");
        creator.toolbox.removeItem("file");
        creator.toolbox.removeItem("signaturepad");
        creator.toolbox.removeItem("ranking");

        creator.showState = false;

        setCreator(creator);
    }
    return (
        <div style={{ overflow: 'auto', height: `calc(100vh - 127px - ${trialHeight}px)` }}>
            <SurveyCreatorComponent creator={creator} />
        </div>
    );
};

export default FormBuilder;