import { useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { useTrialHeight } from "../../../../app/providers/trial-height-provider";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

const defaultCreatorOptions = {
    autoSaveEnabled: true,
    collapseOnDrag: true
};


const FormBuilder = () => {
    const { trialHeight } = useTrialHeight();
    let [creator, setCreator] = useState(null);
    if (!creator) {
        creator = new SurveyCreator(defaultCreatorOptions);
        setCreator(creator);
    }
    return (
        <div style={{ overflow: 'auto', height: `calc(100vh - 127px - ${trialHeight}px)` }}>
            <SurveyCreatorComponent creator={creator} />
        </div>
    );
};

export default FormBuilder;