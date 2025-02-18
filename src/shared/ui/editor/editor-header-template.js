export const renderHeader = () => {
    return (
        <>
            <span className="ql-formats">
                <button className="ql-bold me-1" aria-label="Bold"></button>
                <button className="ql-italic me-1" aria-label="Italic"></button>
                <button className="ql-underline me-1" aria-label="Underline"></button>
            </span>
            <span className="ql-formats">
                <button className="ql-list me-1" value="ordered" aria-label="Ordered List" />
                <button className="ql-list me-1" value="bullet" aria-label="Unordered List" />
                <button className="ql-indent me-1" value="-1" aria-label="Indent" />
                <button className="ql-indent me-1" value="+1" aria-label="Outdent" />
            </span>
            <span className="ql-formats">
                <select className="ql-size me-1">
                    <option value="small">Small</option>
                    <option value="" selected>Normal</option>
                    <option value="large">Large</option>
                    <option value="huge">Huge</option>
                </select>
                <select className="ql-color me-1" />
                <button className="ql-link me-1" value="+1" aria-label="Outdent" />
            </span>
        </>
    );
};