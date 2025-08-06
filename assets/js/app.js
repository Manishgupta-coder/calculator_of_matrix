// --- Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    const rowsInput = document.getElementById("rows");
    const colsInput = document.getElementById("cols");
    const operationSelect = document.getElementById("operation");
    const generateBtn = document.getElementById("generate-btn");
    const calculateBtn = document.getElementById("calculate-btn");
    const matrixAContainer = document.getElementById("matrixA");
    const matrixBContainer = document.getElementById("matrixB");
    const resultContent = document.getElementById("result-content");
    const errorBox = document.getElementById("error");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const explanationBox = document.getElementById("operation-explanation");
    
    const initialExplanationWrapper = document.getElementById("initial-explanation-wrapper");
    const matrixExplanationWrapper = document.getElementById("matrix-explanation-wrapper");
    const resultExplanationWrapper = document.getElementById("result-explanation-wrapper");

    const explanations = {
        add: `<h4>Matrix Addition ($$A + B$$)</h4><p>Matrix addition is an element-wise operation. For two matrices $$A$$ and $$B$$ of the same dimensions, say $$m \times n$$, their sum $$C$$ is a matrix where each element is the sum of the corresponding elements from $$A$$ and $$B$$. Mathematically, this is expressed as: $$C_{ij} = A_{ij} + B_{ij}$$.</p>`,
        subtract: `<h4>Matrix Subtraction ($$A - B$$)</h4><p>Similar to addition, subtraction is also performed element-wise. For two matrices $$A$$ and $$B$$ of the same dimensions, their difference $$C$$ is a matrix where each element is the difference of the corresponding elements from $$A$$ and $$B$$. This is given by the formula: $$C_{ij} = A_{ij} - B_{ij}$$.</p>`,
        multiply: `<h4>Matrix Multiplication ($$A \times B$$)</h4><p>Matrix multiplication is a more complex operation with a specific dimension requirement. If matrix $$A$$ is of size $$m \times n$$ and matrix $$B$$ is of size $$n \times p$$, their product $$C$$ will be a matrix of size $$m \times p$$. Each element of $$C$$ is the dot product of a row from $$A$$ and a column from $$B$$. The formula for an element at row $$i$$ and column $$j$$ is: $$C_{ij} = \sum_{k=1}^{n} A_{ik} B_{kj}$$.</p>`,
        transpose: `<h4>Matrix Transpose ($$A^T$$)</h4><p>The transpose of an $$m \times n$$ matrix $$A$$ is an $$n \times m$$ matrix, denoted as $$A^T$$. It is obtained by swapping the rows and columns of the original matrix. The element in the $$i$$-th row and $$j$$-th column of $$A^T$$ is the element in the $$j$$-th row and $$i$$-th column of $$A$$. This relationship is defined as: $$(A^T)_{ij} = A_{ji}$$.</p>`,
        determinant: `<h4>Matrix Determinant ($$|A|$$)</h4><p>The determinant is a scalar value associated with a square matrix. For a $$2 \times 2$$ matrix $$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$, the determinant is calculated as $$|A| = ad - bc$$. For larger matrices, the determinant is found using a recursive method called cofactor expansion. The determinant provides crucial information about a matrix; for example, a matrix is invertible if and only if its determinant is non-zero.</p>`,
        inverse: `<h4>Matrix Inverse ($$A^{-1}$$)</h4><p>The inverse of a square matrix $$A$$ is another matrix $$A^{-1}$$ such that their product is the identity matrix, $$A A^{-1} = A^{-1} A = I$$. A matrix is invertible only if its determinant is non-zero. The inverse can be calculated using the formula: $$A^{-1} = \frac{1}{|A|} \operatorname{adj}(A)$$, where $$|A|$$ is the determinant and $$adj(A)$$ is the adjoint of $$A$$.</p>`,
        adjoint: `<h4>Adjoint of a Matrix</h4><p>The adjoint of a square matrix $$A$$ is the transpose of its cofactor matrix, denoted as $$C^T$$. The cofactor of an element $$A_{ij}$$ is calculated as $$C_{ij} = (-1)^{i+j}M_{ij}$$, where $$M_{ij}$$ is the determinant of the submatrix obtained by deleting the $$i$$-th row and $$j$$-th column of $$A$$. The adjoint is a key component in calculating the inverse of a matrix.</p>`,
        rank: `<h4>Rank of a Matrix</h4><p>The rank of a matrix is a fundamental property defined as the maximum number of linearly independent row or column vectors. It can be determined by transforming the matrix into its row echelon form using Gaussian elimination and then counting the number of non-zero rows. The rank of a matrix $$A$$ is denoted as $$rank(A)$$.</p>`,
        lu: `<h4>LU Decomposition</h4><p>LU Decomposition is a matrix factorization that splits a square matrix $$A$$ into the product of a lower triangular matrix $$L$$ and an upper triangular matrix $$U$$, such that $$A = LU$$. A lower triangular matrix has all elements above the main diagonal equal to zero, while an upper triangular matrix has all elements below the main diagonal equal to zero. This decomposition is widely used in numerical analysis for efficiently solving systems of linear equations.</p>`,
        eigen: `<h4>Eigenvalues ($$\lambda$$)</h4><p>Eigenvalues are special scalar values associated with a square matrix, often denoted by the Greek letter $$\lambda$$. They are the roots of the characteristic equation, which is given by $$det(A - \lambda I) = 0$$, where $$I$$ is the identity matrix of the same size as $$A$$. For a $$2 \times 2$$ matrix, this equation simplifies to a quadratic equation: $$\lambda^2 - \operatorname{tr}(A)\lambda + \det(A) = 0$$, where $$\operatorname{tr}(A)$$ is the trace (sum of the main diagonal elements) of the matrix. This calculator solves this equation to find the eigenvalues.</p>`
    };

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.toggle('active', page.id === pageId);
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.hash === '#' + pageId);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.hash.substring(1);
            showPage(pageId);
        });
    });

    function handleOperationChange() {
        const op = operationSelect.value;
        const matrixBWrapper = document.getElementById("matrixB-wrapper");
        matrixBWrapper.style.display = op === "add" || op === "subtract" || op === "multiply" ? "block" : "none";
        
        explanationBox.innerHTML = explanations[op];
        explanationBox.style.display = 'block';
        
        initialExplanationWrapper.appendChild(explanationBox);
        matrixExplanationWrapper.innerHTML = '';
        resultExplanationWrapper.innerHTML = '';

        // Re-render MathJax content
        if (window.MathJax) {
            window.MathJax.typesetPromise().then(() => {});
        }

        // For some operations, matrix must be square
        if (['determinant', 'inverse', 'adjoint', 'lu', 'eigen'].includes(op)) {
            colsInput.value = rowsInput.value;
        }
    }

    function generateMatrices() {
        errorBox.textContent = "";
        resultContent.innerHTML = "";
        document.getElementById("result").style.display = "none";
        const rows = parseInt(rowsInput.value);
        const cols = parseInt(colsInput.value);
        const op = operationSelect.value;

        if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
            errorBox.textContent = "Invalid matrix size";
            return;
        }
        
        if (['determinant', 'inverse', 'adjoint', 'lu', 'eigen'].includes(op) && rows !== cols) {
            errorBox.textContent = `Operation '${op}' requires a square matrix (rows = columns).`;
            return;
        }
        // Specific dimension check for eigenvalues
        if (op === 'eigen' && (rows !== 2 || cols !== 2)) {
            errorBox.textContent = `Eigenvalue calculation is only supported for 2x2 matrices.`;
            return;
        }


        matrixAContainer.innerHTML = "";
        matrixBContainer.innerHTML = "";
        createMatrixInputs(matrixAContainer, rows, cols, 'A');

        const matrixBWrapper = document.getElementById("matrixB-wrapper");
        if (op === 'add' || op === 'subtract') {
            matrixBWrapper.style.display = "block";
            createMatrixInputs(matrixBContainer, rows, cols, 'B');
        } else if (op === 'multiply') {
            matrixBWrapper.style.display = "block";
            // For multiplication, B's rows must equal A's cols. We'll generate a compatible matrix.
            createMatrixInputs(matrixBContainer, cols, Math.max(1, parseInt(colsInput.value)), 'B');
        }
        else {
            matrixBWrapper.style.display = "none";
        }

        document.getElementById("matrix-section").style.display = "block";
        calculateBtn.disabled = false;
        
        // Move explanation below matrices
        matrixExplanationWrapper.appendChild(explanationBox);
        
        if (window.MathJax) {
            window.MathJax.typesetPromise().then(() => {});
        }
    }

    function createMatrixInputs(container, rows, cols, prefix) {
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j < cols; j++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.id = `${prefix}_${i}_${j}`;
            input.value = Math.floor(Math.random() * 10);
            td.appendChild(input);
            tr.appendChild(td);
            }
            container.appendChild(tr);
        }
    }

    function calculate() {
        errorBox.textContent = "";
        const op = operationSelect.value;
        let matrixA, matrixB, result;
        
        try {
            const rowsA = matrixAContainer.rows.length;
            const colsA = matrixAContainer.rows[0].cells.length;
            matrixA = readMatrix('A', rowsA, colsA);

            if (op === 'add' || op === 'subtract' || op === 'multiply') {
                const rowsB = matrixBContainer.rows.length;
                const colsB = matrixBContainer.rows[0].cells.length;
                matrixB = readMatrix('B', rowsB, colsB);
            }

            switch (op) {
                case 'add': result = addMatrices(matrixA, matrixB); break;
                case 'subtract': result = subtractMatrices(matrixA, matrixB); break;
                case 'multiply': result = multiplyMatrices(matrixA, matrixB); break;
                case 'transpose': result = transposeMatrix(matrixA); break;
                case 'determinant': result = [[calculateDeterminant(matrixA)]]; break;
                case 'inverse': result = calculateInverse(matrixA); break;
                case 'adjoint': result = calculateAdjoint(matrixA); break;
                case 'rank': result = calculateRank(matrixA); break;
                case 'lu': result = luDecomposition(matrixA); break;
                case 'eigen': result = calculateEigenvalues(matrixA); break;
                default: throw new Error("Unsupported operation");
            }
            displayResult(result);
            
            // Move explanation below result
            resultExplanationWrapper.appendChild(explanationBox);
            
            if (window.MathJax) {
                window.MathJax.typesetPromise().then(() => {});
            }
            
        } catch (err) {
            errorBox.textContent = err.message;
        }
    }

    function readMatrix(prefix, rows, cols) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
            const val = parseFloat(document.getElementById(`${prefix}_${i}_${j}`).value);
            if (isNaN(val)) throw new Error("Matrix contains invalid numbers. Please fill all cells.");
            row.push(val);
            }
            matrix.push(row);
        }
        return matrix;
    }

    function displayResult(result) {
        resultContent.innerHTML = '';
        const table = document.createElement("table");

        result.forEach((row) => {
            const tr = document.createElement("tr");
            if (Array.isArray(row) && (row.includes('---') || row.some(item => typeof item === 'string'))) {
                const td = document.createElement("td");
                td.textContent = row.join(' ');
                td.colSpan = result[0].length; 
                td.style.textAlign = "center";
                td.style.fontWeight = "bold";
                td.style.border = "none";
                tr.appendChild(td);
            } else {
                const valuesToDisplay = Array.isArray(row) ? row : [row];
                valuesToDisplay.forEach(val => {
                    const td = document.createElement("td");
                    td.textContent = typeof val === 'number' ?
                    (Number.isInteger(val) ? val : val.toFixed(2)) :
                    val;
                    tr.appendChild(td);
                });
            }
            table.appendChild(tr);
        });

        resultContent.appendChild(table);
        document.getElementById("result").style.display = "block";
    }

    function toggleDarkMode(e) {
        document.body.classList.toggle("dark-mode", e.target.checked);
    }

    // Initial setup
    operationSelect.addEventListener("change", handleOperationChange);
    generateBtn.addEventListener("click", generateMatrices);
    calculateBtn.addEventListener("click", calculate);
    darkModeToggle.addEventListener("change", toggleDarkMode);
    
    // Show initial explanation
    handleOperationChange();
    // Set initial page
    showPage('home');
});