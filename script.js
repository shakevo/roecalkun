let yearCount = 1;

// 決算年月入力を追加する関数
function addYear() {
    yearCount++;
    const yearGroup = document.createElement('div');
    yearGroup.className = 'year-group';
    yearGroup.innerHTML = `
        <h2>--</h2>
        <div class="form-group">
            <label for="year">決算年月</label>
            <input type="month" class="year" required onchange="updateYear(this)">
        </div>
        <div class="form-group">
            <label for="netIncome">当期純利益</label>
            <input type="number" class="netIncome" required>
        </div>
        <div class="form-group">
            <label for="equity">自己資本</label>
            <input type="number" class="equity" required>
        </div>
        <div class="form-group">
            <label for="assets">総資産</label>
            <input type="number" class="assets" required>
        </div>
        <div class="form-group">
            <label for="investmentIncome">投資利益</label>
            <input type="number" class="investmentIncome" required>
        </div>
        <div class="form-group">
            <label for="investment">投資額</label>
            <input type="number" class="investment" required>
        </div>
    `;
    document.getElementById('years-container').appendChild(yearGroup);
}

// 決算年月を更新する関数
function updateYear(input) {
    const yearGroup = input.closest('.year-group');
    const yearValue = input.value;
    if (yearValue) {
        const [year, month] = yearValue.split('-');
        yearGroup.querySelector('h2').innerText = `${year}年${month}月`;
    } else {
        yearGroup.querySelector('h2').innerText = '--';
    }
}

// 計算を実行する関数
function calculate() {
    const unit = parseFloat(document.getElementById('unit').value);
    const years = document.querySelectorAll('.year');
    const netIncomes = document.querySelectorAll('.netIncome');
    const equities = document.querySelectorAll('.equity');
    const assets = document.querySelectorAll('.assets');
    const investmentIncomes = document.querySelectorAll('.investmentIncome');
    const investments = document.querySelectorAll('.investment');
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    let results = [];
    for (let i = 0; i < years.length; i++) {
        const yearValue = years[i].value;
        const [year, month] = yearValue.split('-');
        const formattedYear = `${year}年${month}月`;

        const netIncome = parseFloat(netIncomes[i].value) * unit;
        const equity = parseFloat(equities[i].value) * unit;
        const assetsValue = parseFloat(assets[i].value) * unit;
        const investmentIncome = parseFloat(investmentIncomes[i].value) * unit;
        const investment = parseFloat(investments[i].value) * unit;

        const roe = (netIncome / equity) * 100;
        const roa = (netIncome / assetsValue) * 100;
        const roi = (investmentIncome / investment) * 100;

        results.push({ year: yearValue, formattedYear, roe: roe.toFixed(2), roa: roa.toFixed(2), roi: roi.toFixed(2) });
    }

    // 決算年月順に降順で並び替え
    results.sort((a, b) => b.year.localeCompare(a.year));

    let table = '<table class="result-table"><thead><tr><th>決算年月</th><th>ROE</th><th>ROA</th><th>ROI</th></tr></thead><tbody>';
    results.forEach((result, index) => {
        let previousResult = results[index + 1];
        let roeDiff = '', roaDiff = '', roiDiff = '';

        if (previousResult) {
            roeDiff = calculateDifference(result.roe, previousResult.roe);
            roaDiff = calculateDifference(result.roa, previousResult.roa);
            roiDiff = calculateDifference(result.roi, previousResult.roi);
        }

        table += `<tr><td>${result.formattedYear}</td><td>${result.roe}% ${roeDiff}</td><td>${result.roa}% ${roaDiff}</td><td>${result.roi}% ${roiDiff}</td></tr>`;
    });
    table += '</tbody></table>';

    resultContainer.innerHTML = table;
    addTwitterButton(results);
}

// 前年度比を計算する関数
function calculateDifference(current, previous) {
    const diff = (current - previous).toFixed(2);
    const sign = diff > 0 ? '+' : '';
    return `(${sign}${diff}%)`;
}

// Twitterボタンを追加する関数
function addTwitterButton(results) {
    const resultContainer = document.getElementById('result-container');
    const company = document.getElementById('company').value;
    const latestResult = results[0]; // 最新の年度データを取得

    const tweetButton = document.createElement('button');
    tweetButton.id = 'twitter-button';
    tweetButton.innerText = '結果をTwitterに投稿';
    tweetButton.style.marginTop = '20px'; // ボタンの上にスペースを追加
    tweetButton.onclick = function() {
        const text = `${company}の情報です。ROEは${latestResult.roe}%, ROAは${latestResult.roa}%, ROIは${latestResult.roi}% (${latestResult.formattedYear}) ※情報には誤りがある可能性があります,正しくは公式に発表された情報をご確認ください #ROI計算くん`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };
    resultContainer.appendChild(tweetButton);
}

// CSVをダウンロードする関数
function downloadCSV() {
    const company = document.getElementById('company').value;
    const years = document.querySelectorAll('.year');
    const netIncomes = document.querySelectorAll('.netIncome');
    const equities = document.querySelectorAll('.equity');
    const assets = document.querySelectorAll('.assets');
    const investmentIncomes = document.querySelectorAll('.investmentIncome');
    const investments = document.querySelectorAll('.investment');
    let csvContent = '決算年月,会社名,ROE,ROA,ROI,前年度比ROE,前年度比ROA,前年度比ROI\n';

    let results = [];
    for (let i = 0; i < years.length; i++) {
        const yearValue = years[i].value;
        const [year, month] = yearValue.split('-');
        const formattedYear = `${year}年${month}月`;

        const netIncome = parseFloat(netIncomes[i].value) * parseFloat(document.getElementById('unit').value);
        const equity = parseFloat(equities[i].value) * parseFloat(document.getElementById('unit').value);
        const assetsValue = parseFloat(assets[i].value) * parseFloat(document.getElementById('unit').value);
        const investmentIncome = parseFloat(investmentIncomes[i].value) * parseFloat(document.getElementById('unit').value);
        const investment = parseFloat(investments[i].value) * parseFloat(document.getElementById('unit').value);

        const roe = (netIncome / equity) * 100;
        const roa = (netIncome / assetsValue) * 100;
        const roi = (investmentIncome / investment) * 100;

        results.push({ year: yearValue, formattedYear, roe: roe.toFixed(2), roa: roa.toFixed(2), roi: roi.toFixed(2) });
    }

    // 決算年月順に降順で並び替え
    results.sort((a, b) => b.year.localeCompare(a.year));

    results.forEach((result, index) => {
        let previousResult = results[index + 1];
        let roeDiff = '', roaDiff = '', roiDiff = '';

        if (previousResult) {
            roeDiff = calculateDifference(result.roe, previousResult.roe);
            roaDiff = calculateDifference(result.roa, previousResult.roa);
            roiDiff = calculateDifference(result.roi, previousResult.roi);
        }

        csvContent += `${result.formattedYear},${company},${result.roe}%,${result.roa}%,${result.roi}%,${roeDiff},${roaDiff},${roiDiff}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${company}_financials.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
