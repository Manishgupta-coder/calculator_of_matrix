// --- Matrix Operations Logic ---
function addMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a, b) {
    if (a[0].length !== b.length) throw new Error("Matrix dimensions do not allow multiplication (A's columns must equal B's rows)");
    return a.map((row, i) =>
        b[0].map((_, j) => row.reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0))
    );
}

function transposeMatrix(m) {
    return m[0].map((_, i) => m.map(row => row[i]));
}

function calculateDeterminant(m) {
    const n = m.length;
    if (n !== m[0].length) throw new Error("Matrix must be square for determinant");
    if (n === 1) return m[0][0];
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    let det = 0;
    for (let i = 0; i < n; i++) {
        const minor = m.slice(1).map(row => row.filter((_, j) => j !== i));
        det += m[0][i] * Math.pow(-1, i) * calculateDeterminant(minor);
    }
    return det;
}

function calculateAdjoint(m) {
    const n = m.length;
    if (n !== m[0].length) throw new Error("Matrix must be square for adjoint");
    const adj = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const minor = m.filter((_, x) => x !== i).map(row => row.filter((_, y) => y !== j));
            adj[j][i] = Math.pow(-1, i + j) * calculateDeterminant(minor);
        }
    }
    return adj;
}

function calculateInverse(m) {
    const det = calculateDeterminant(m);
    if (det === 0) throw new Error("Matrix is singular; inverse doesn't exist");
    const adj = calculateAdjoint(m);
    return adj.map(row => row.map(val => val / det));
}
    
function calculateRank(matrix) {
    let m = matrix.map(row => [...row]);
    let rank = Math.min(m.length, m[0].length);
    let lead = 0;
    for (let r = 0; r < m.length; r++) {
        if (lead >= m[0].length) return [[rank]];
        let i = r;
        while (m[i][lead] === 0) {
            i++;
            if (i === m.length) {
                i = r;
                lead++;
                if (lead === m[0].length) return [[rank]];
            }
        }
        [m[i], m[r]] = [m[r], m[i]];
        let val = m[r][lead];
        for (let j = 0; j < m[0].length; j++) m[r][j] /= val;
        for (let i = 0; i < m.length; i++) {
            if (i !== r) {
                val = m[i][lead];
                for (let j = 0; j < m[0].length; j++) {
                    m[i][j] -= val * m[r][j];
                }
            }
        }
        lead++;
    }
    let zeroRows = 0;
    for(let row of m){
        if(row.every(val => Math.abs(val) < 1e-9)) zeroRows++;
    }
    return [[m.length - zeroRows]];
}


function luDecomposition(matrix) {
    const n = matrix.length;
    if(n !== matrix[0].length) throw new Error("Matrix must be square for LU Decomposition.");
    const L = Array(n).fill().map(() => Array(n).fill(0));
    const U = Array(n).fill().map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let k = i; k < n; k++) {
            let sum = 0;
            for (let j = 0; j < i; j++) sum += L[i][j] * U[j][k];
            U[i][k] = matrix[i][k] - sum;
        }

        for (let k = i; k < n; k++) {
            if (i === k) L[i][i] = 1;
            else {
                let sum = 0;
                for (let j = 0; j < i; j++) sum += L[k][j] * U[j][i];
                if (U[i][i] === 0) throw new Error("LU Decomposition not possible (division by zero).");
                L[k][i] = (matrix[k][i] - sum) / U[i][i];
            }
        }
    }
    return [...L, ['L Matrix Above'], ['---'], ['U Matrix Below'], ...U];
}

function calculateEigenvalues(matrix) {
    if (matrix.length !== 2 || matrix[0].length !== 2) throw new Error("Eigenvalue calculation is only supported for 2x2 matrices.");
    const a = 1;
    const b = -(matrix[0][0] + matrix[1][1]); // -(trace)
    const c = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]; // determinant
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return [["Complex eigenvalues"]];
    const lambda1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const lambda2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return [[lambda1, lambda2]];
}