// 名刺作成アプリケーション
class BusinessCardApp {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updatePreview();
        
        // デバッグ用：住所フィールドの確認
        console.log('住所フィールド:', this.addressInput);
        console.log('住所フィールドの値:', this.addressInput?.value);
    }

    initializeElements() {
        this.form = document.getElementById('businessCardForm');
        this.previewContainer = document.getElementById('cardPreview');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // フォーム要素
        this.nameInput = document.getElementById('name');
        this.companyInput = document.getElementById('company');
        this.positionInput = document.getElementById('position');
        this.phoneInput = document.getElementById('phone');
        this.emailInput = document.getElementById('email');
        this.addressInput = document.getElementById('address');
        this.websiteInput = document.getElementById('website');
        this.templateSelect = document.getElementById('template');
        this.colorSelect = document.getElementById('color');
        
        // 住所フィールドにデフォルト値を設定
        if (this.addressInput && !this.addressInput.value) {
            this.addressInput.value = '〒100-0001 東京都千代田区千代田1-1-1';
        }
    }

    bindEvents() {
        // リアルタイムプレビュー更新
        this.form.addEventListener('input', () => this.updatePreview());
        this.templateSelect.addEventListener('change', () => this.updatePreview());
        this.colorSelect.addEventListener('change', () => this.updatePreview());
        
        // ボタンイベント
        this.downloadBtn.addEventListener('click', () => this.downloadCard());
        this.sampleBtn.addEventListener('click', () => this.fillSampleData());
        this.clearBtn.addEventListener('click', () => this.clearForm());
    }

    updatePreview() {
        const cardData = this.getFormData();
        console.log('カードデータ:', cardData); // デバッグ用
        const cardHTML = this.generateCardHTML(cardData);
        this.previewContainer.innerHTML = cardHTML;
    }

    getFormData() {
        const addressValue = this.addressInput?.value || '〒100-0001 東京都千代田区千代田1-1-1';
        console.log('住所の値:', addressValue); // デバッグ用
        
        return {
            name: this.nameInput.value || '山田太郎',
            company: this.companyInput.value || '株式会社サンプル',
            position: this.positionInput.value || '営業部長',
            phone: this.phoneInput.value || '03-1234-5678',
            email: this.emailInput.value || 'yamada@sample.com',
            address: addressValue,
            website: this.websiteInput.value || 'www.sample.com',
            template: this.templateSelect.value,
            color: this.colorSelect.value
        };
    }

    generateCardHTML(data) {
        const template = data.template;
        const color = data.color;
        
        return `
            <div class="business-card ${template} ${color}">
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-name">${this.escapeHtml(data.name)}</h3>
                        <p class="card-company">${this.escapeHtml(data.company)}</p>
                        <p class="card-position">${this.escapeHtml(data.position)}</p>
                    </div>
                    
                    <div class="card-contact">
                        <p>📞 ${this.escapeHtml(data.phone)}</p>
                        <p>📧 ${this.escapeHtml(data.email)}</p>
                        <p>🌐 ${this.escapeHtml(data.website)}</p>
                    </div>
                    
                    <p class="card-address">${this.escapeHtml(data.address)}</p>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async downloadCard() {
        try {
            const cardData = this.getFormData();
            
            // 完全なHTMLファイルを生成
            const htmlContent = this.generateCompleteHTML(cardData);
            
            // Blobを作成してダウンロード
            const blob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `business-card-${cardData.name}.html`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            this.showNotification('名刺がダウンロードされました！', 'success');
        } catch (error) {
            console.error('ダウンロードエラー:', error);
            this.showNotification('ダウンロードに失敗しました。', 'error');
        }
    }

    generateCompleteHTML(data) {
        const template = data.template;
        const color = data.color;
        
        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>名刺 - ${this.escapeHtml(data.name)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .business-card {
            width: 450px;
            height: 280px;
            border-radius: 15px;
            padding: 35px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        
        .business-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            pointer-events: none;
        }
        
        .business-card.classic {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid #e9ecef;
        }
        
        .business-card.modern {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .business-card.minimal {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 1px solid #dee2e6;
        }
        
        .business-card.creative {
            background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
        }
        
        .business-card.blue {
            border-left: 5px solid #667eea;
        }
        
        .business-card.green {
            border-left: 5px solid #28a745;
        }
        
        .business-card.red {
            border-left: 5px solid #dc3545;
        }
        
        .business-card.purple {
            border-left: 5px solid #6f42c1;
        }
        
        .business-card.orange {
            border-left: 5px solid #fd7e14;
        }
        
        .card-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 12px;
            position: relative;
            z-index: 1;
        }
        
        .card-header {
            margin-bottom: 0;
        }
        
        .card-name {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
        }
        
        .business-card.modern .card-name,
        .business-card.creative .card-name {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .card-company {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 6px;
            color: #495057;
            line-height: 1.2;
        }
        
        .business-card.modern .card-company,
        .business-card.creative .card-company {
            color: rgba(255, 255, 255, 0.9);
        }
        
        .card-position {
            font-size: 1.1rem;
            color: #6c757d;
            margin-bottom: 0;
            font-weight: 500;
            line-height: 1.2;
        }
        
        .business-card.modern .card-position,
        .business-card.creative .card-position {
            color: rgba(255, 255, 255, 0.8);
        }
        
        .card-contact {
            margin-bottom: 0;
        }
        
        .card-contact p {
            font-size: 1rem;
            margin-bottom: 4px;
            color: #495057;
            display: flex;
            align-items: center;
            gap: 8px;
            line-height: 1.3;
        }
        
        .card-contact p:last-child {
            margin-bottom: 0;
        }
        
        .card-address {
            font-size: 0.9rem;
            color: #777;
            line-height: 1.4;
            font-weight: 500;
            margin-top: 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
            flex-shrink: 0;
        }
        
        .business-card.modern .card-address,
        .business-card.creative .card-address {
            color: rgba(255, 255, 255, 0.8);
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .business-card {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="business-card ${template} ${color}">
        <div class="card-content">
            <div class="card-header">
                <h3 class="card-name">${this.escapeHtml(data.name)}</h3>
                <p class="card-company">${this.escapeHtml(data.company)}</p>
                <p class="card-position">${this.escapeHtml(data.position)}</p>
            </div>
            
            <div class="card-contact">
                <p>📞 ${this.escapeHtml(data.phone)}</p>
                <p>📧 ${this.escapeHtml(data.email)}</p>
                <p>🌐 ${this.escapeHtml(data.website)}</p>
            </div>
            
            <p class="card-address">${this.escapeHtml(data.address)}</p>
        </div>
    </div>
    
    <script>
        // 印刷機能
        window.onload = function() {
            // 印刷ダイアログを自動で開く（オプション）
            // setTimeout(function() { window.print(); }, 1000);
        };
    </script>
</body>
</html>`;
    }

    downloadAsImage() {
        // このメソッドは不要になったので削除
        this.showNotification('HTMLファイルとしてダウンロードされました。', 'info');
    }

    // サンプルデータでフォームを埋める
    fillSampleData() {
        this.nameInput.value = '田中花子';
        this.companyInput.value = 'テック株式会社';
        this.positionInput.value = 'Webデザイナー';
        this.phoneInput.value = '090-1234-5678';
        this.emailInput.value = 'tanaka@tech.co.jp';
        this.addressInput.value = '〒150-0043 東京都渋谷区道玄坂1-1-1';
        this.websiteInput.value = 'www.tech.co.jp';
        this.templateSelect.value = 'modern';
        this.colorSelect.value = 'purple';
        this.updatePreview();
        this.showNotification('サンプルデータが入力されました！', 'info');
    }

    // フォームをクリア
    clearForm() {
        this.form.reset();
        this.updatePreview();
        this.showNotification('フォームがクリアされました！', 'info');
    }

    // 通知を表示
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // アニメーション表示
        setTimeout(() => notification.classList.add('show'), 100);
        
        // 自動削除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const app = new BusinessCardApp();
    
    // グローバルにアクセス可能にする
    window.businessCardApp = app;
    
    // デバッグ用：コンソールからアクセス可能
    console.log('名刺作成アプリが起動しました。');
    console.log('window.businessCardApp.fillSampleData() でサンプルデータを入力できます。');
    console.log('window.businessCardApp.clearForm() でフォームをクリアできます。');
});

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                window.businessCardApp?.downloadCard();
                break;
            case 'r':
                e.preventDefault();
                window.businessCardApp?.fillSampleData();
                break;
            case 'c':
                e.preventDefault();
                window.businessCardApp?.clearForm();
                break;
        }
    }
}); 
