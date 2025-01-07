import { SelectedCell } from "../../interfaces";

const splitImageIntoPixels = (image: HTMLImageElement, colsP: string, rowsP: string, selectedCells: HTMLDivElement[]): Promise<SelectedCell[]> => {
    return new Promise((resolve, reject) => {
        const cellData: SelectedCell[] = [];
        image.onload = () => {
            const cols = parseInt(colsP, 10);
            const rows = parseInt(rowsP, 10);

            const imageWidth = image.width;
            const imageHeight = image.height;
            const cellWidth = 10;
            const cellHeight = 10;

            const partWidth = Math.floor(imageWidth / cols);
            const partHeight = Math.floor(imageHeight / rows);

            selectedCells.forEach((cell, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;

                const canvas = document.createElement("canvas");
                canvas.width = cellWidth;
                canvas.height = cellHeight;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    ctx.drawImage(
                        image,
                        col * partWidth,
                        row * partHeight,
                        partWidth,
                        partHeight  ,
                        0,
                        0,
                        cellWidth,
                        cellHeight
                    );

                    cell.innerHTML = "";
                    cell.appendChild(canvas);
                    cell.style.backgroundColor = "transparent";
                    cellData.push({
                        cellId: parseInt(cell.dataset.id || "0", 10),
                        canvasData: canvas.toDataURL(),
                    });
                }
            });

            resolve(cellData);
        };

        image.onerror = () => {
            reject(new Error("Failed to load image"));
        };
    });
};

const isItValidCell = ( 
    selectedCells: HTMLDivElement[], 
    formik: { values: { rows: string; cols: string; } }, 
): {
    isValid: boolean,
    errorMessage: string
} => {
    let errorMessage = "";
    if (selectedCells.length == 0) {
        errorMessage = "يجب تحديد عدد الخلايا المطلوبة علي المصفوفة";
        return { isValid: false, errorMessage };
    } else if (parseInt(formik.values.rows, 10) === 0 || parseInt(formik.values.cols, 10) === 0) {
        errorMessage = "يجب تحديد عدد الصفوف والأعمدة";
        return { isValid: false, errorMessage };
    } else if (selectedCells.length !== (parseInt(formik.values.rows, 10) * parseInt(formik.values.cols, 10))) {
        errorMessage = "عدد الخلايا المحددة لا يتطابق مع عدد الصفوف والأعمدة المحددة";
        return { isValid: false, errorMessage };
    }
    return { isValid: true, errorMessage: "" };
};

export { splitImageIntoPixels, isItValidCell };