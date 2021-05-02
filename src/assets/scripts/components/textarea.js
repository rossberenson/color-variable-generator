import autosize from 'autosize';

const TextareaAutoSize = () => {
    let textareas = document.querySelectorAll(".textarea-auto-size");

    autosize(textareas);

}

export default TextareaAutoSize;