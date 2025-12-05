import {
    FiletypeAac, FiletypeAi, FiletypeBmp, FiletypeCs, FiletypeCss, FiletypeCsv, FiletypeDoc, FiletypeDocx, FiletypeExe, FiletypeGif, FiletypeHeic, FiletypeHtml, FiletypeJava, FiletypeJpg, FiletypeJs, FiletypeJson, FiletypeJsx, FiletypeKey, FiletypeM4p, FiletypeMd, FiletypeMdx, FiletypeMov, FiletypeMp3, FiletypeMp4, FiletypeOtf, FiletypePdf, FiletypePhp, FiletypePng, FiletypePpt, FiletypePptx, FiletypePsd, FiletypePy, FiletypeRaw, FiletypeRb, FiletypeSass, FiletypeScss, FiletypeSh, FiletypeSql, FiletypeSvg, FiletypeTiff, FiletypeTsx, FiletypeTtf, FiletypeTxt, FiletypeWav, FiletypeWoff, FiletypeXls, FiletypeXlsx, FiletypeXml, FiletypeYml
} from 'react-bootstrap-icons';


// Map file extensions to their corresponding icon components and default colors
const extensionToIcon = {
    aac: { icon: FiletypeAac, color: '#4CAF50' },
    ai: { icon: FiletypeAi, color: '#FF9800' },
    bmp: { icon: FiletypeBmp, color: '#00ADEF' },
    cs: { icon: FiletypeCs, color: '#239120' },
    css: { icon: FiletypeCss, color: '#1572B6' },
    csv: { icon: FiletypeCsv, color: '#22A746' },
    doc: { icon: FiletypeDoc, color: '#2368E1' },
    docx: { icon: FiletypeDocx, color: '#2368E1' },
    exe: { icon: FiletypeExe, color: '#8E8E8E' },
    gif: { icon: FiletypeGif, color: '#F64A8A' },
    heic: { icon: FiletypeHeic, color: '#FFAA00' },
    html: { icon: FiletypeHtml, color: '#E34F26' },
    java: { icon: FiletypeJava, color: '#007396' },
    jpg: { icon: FiletypeJpg, color: '#FFAA00' },
    jpeg: { icon: FiletypeJpg, color: '#FFAA00' },
    js: { icon: FiletypeJs, color: '#F7DF1E' },
    json: { icon: FiletypeJson, color: '#22A746' },
    jsx: { icon: FiletypeJsx, color: '#61DAFB' },
    key: { icon: FiletypeKey, color: '#FF9800' },
    m4p: { icon: FiletypeM4p, color: '#4CAF50' },
    md: { icon: FiletypeMd, color: '#8E8E8E' },
    mdx: { icon: FiletypeMdx, color: '#8E8E8E' },
    mov: { icon: FiletypeMov, color: '#9C27B0' },
    mp3: { icon: FiletypeMp3, color: '#4CAF50' },
    mp4: { icon: FiletypeMp4, color: '#9C27B0' },
    otf: { icon: FiletypeOtf, color: '#795548' },
    pdf: { icon: FiletypePdf, color: '#FF0000' },
    php: { icon: FiletypePhp, color: '#777BB4' },
    png: { icon: FiletypePng, color: '#00ADEF' },
    ppt: { icon: FiletypePpt, color: '#FF9800' },
    pptx: { icon: FiletypePptx, color: '#FF9800' },
    psd: { icon: FiletypePsd, color: '#31A8FF' },
    py: { icon: FiletypePy, color: '#3776AB' },
    raw: { icon: FiletypeRaw, color: '#FFAA00' },
    rb: { icon: FiletypeRb, color: '#CC342D' },
    sass: { icon: FiletypeSass, color: '#CF649A' },
    scss: { icon: FiletypeScss, color: '#CF649A' },
    sh: { icon: FiletypeSh, color: '#8E8E8E' },
    sql: { icon: FiletypeSql, color: '#336791' },
    svg: { icon: FiletypeSvg, color: '#FF5722' },
    tiff: { icon: FiletypeTiff, color: '#FFAA00' },
    tsx: { icon: FiletypeTsx, color: '#3178C6' },
    ttf: { icon: FiletypeTtf, color: '#795548' },
    txt: { icon: FiletypeTxt, color: '#8E8E8E' },
    wav: { icon: FiletypeWav, color: '#795548' },
    woff: { icon: FiletypeWoff, color: '#795548' },
    xls: { icon: FiletypeXls, color: '#22A746' },
    xlsx: { icon: FiletypeXlsx, color: '#22A746' },
    xml: { icon: FiletypeXml, color: '#E34F26' },
    yml: { icon: FiletypeYml, color: '#8E8E8E' },
    // Additional common extensions not in bootstrap icons
    zip: { icon: FiletypeExe, color: '#FFD700' },
    rar: { icon: FiletypeExe, color: '#F44336' },
    tar: { icon: FiletypeExe, color: '#FFC107' },
    pub: { icon: FiletypeDoc, color: '#4CAF50' },
    swf: { icon: FiletypeExe, color: '#FFEB3B' },
};

export const BootstrapFileIcons = ({ extension, color, size }) => {
    const ext = extension?.toLowerCase();
    const iconData = extensionToIcon[ext];
    if (iconData) {
        const Icon = iconData.icon;
        const iconColor = color || iconData.color;
        return <Icon color={iconColor} size={size} />;
    }
    // fallback generic file icon
    return <svg width="1em" height="1em" viewBox="0 0 16 16" fill={color || '#888'} xmlns="http://www.w3.org/2000/svg"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.5L9.5 0H4zm8 1.5V6H9V1h3z"/></svg>;
};
