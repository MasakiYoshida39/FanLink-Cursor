// 名刺作成アプリケーション
class BusinessCardApp {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updatePreview();
        
        // QRGen QRコード生成システムの初期化
        this.initializeQRGenQRCode();
    }

    initializeElements() {
        this.form = document.getElementById('businessCardForm');
        this.previewContainer = document.getElementById('cardPreview');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.testQRBtn = document.getElementById('testQRBtn');
        this.qrgenQRTestBtn = document.getElementById('qrgenQRTestBtn');
        this.downloadBg1920Btn = document.getElementById('downloadBg1920Btn');
        this.downloadBg1254Btn = document.getElementById('downloadBg1254Btn');
        
        // フォーム要素
        this.nameInput = document.getElementById('name');
        this.companyInput = document.getElementById('company');
        this.positionInput = document.getElementById('position');
        this.phoneInput = document.getElementById('phone');
        this.emailInput = document.getElementById('email');
        this.addressInput = document.getElementById('address');
        this.websiteInput = document.getElementById('website');
        this.qrUrlInput = document.getElementById('qrUrl');
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
        this.downloadBg1920Btn.addEventListener('click', () => this.downloadCardImage(1920, 1080));
        this.downloadBg1254Btn.addEventListener('click', () => this.downloadCardImage(1254, 758));
    }

    // QRGen QRコード生成システムの初期化
    initializeQRGenQRCode() {
        console.log('QRGen QRコード生成システムを初期化中...');
        
        // QRGenライブラリが利用可能かチェック
        if (typeof qrcode !== 'undefined') {
            this.qrgenQRCodeAvailable = true;
            console.log('✅ QRGenライブラリが利用可能です');
        } else {
            this.qrgenQRCodeAvailable = false;
            console.log('⚠️ QRGenライブラリが利用できません、フォールバックを使用します');
        }
    }

    updatePreview() {
        const cardData = this.getFormData();
        this.generateCardHTML(cardData).then(cardHTML => {
            this.previewContainer.innerHTML = cardHTML;
        });
    }

    getFormData() {
        const addressValue = this.addressInput?.value || '〒100-0001 東京都千代田区千代田1-1-1';
        
        return {
            name: this.nameInput.value || '山田太郎',
            company: this.companyInput.value || '株式会社サンプル',
            position: this.positionInput.value || '営業部長',
            phone: this.phoneInput.value || '03-1234-5678',
            email: this.emailInput.value || 'yamada@sample.com',
            address: addressValue,
            website: this.websiteInput.value || 'www.sample.com',
            qrUrl: this.qrUrlInput.value || '',
            template: this.templateSelect.value,
            color: this.colorSelect.value
        };
    }

    async generateCardHTML(data) {
        const template = data.template;
        const color = data.color;
        
        // QRコードを生成
        let qrCodeHTML = '';
        if (data.qrUrl && data.qrUrl.trim() !== '') {
            try {
                console.log('QRコード生成を試行:', data.qrUrl);
                const qrCodeDataURL = await this.generateQRCode(data.qrUrl, 60);
                
                if (qrCodeDataURL) {
                    qrCodeHTML = `
                        <div class="qr-code" style="width: 60px; height: 60px; border-radius: 6px; background: white; padding: 4px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); flex-shrink: 0; border: 1px solid #e0e0e0; display: block; position: relative; margin-left: 10px;">
                            <img src="${qrCodeDataURL}" alt="QR Code" title="QR Code for ${data.qrUrl}" style="width: 100%; height: 100%; border-radius: 3px; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; display: block; object-fit: contain;">
                        </div>
                    `;
                    console.log('✅ QRコード生成成功');
                } else {
                    console.warn('QRコード生成に失敗しました');
                    qrCodeHTML = `
                        <div class="qr-code error" style="width: 60px; height: 60px; border-radius: 6px; background: #fee; padding: 4px; border: 1px solid #fcc; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #c33; font-size: 0.6rem; text-align: center; margin-left: 10px;">
                            <span>QR生成エラー</span>
                            <small>${data.qrUrl}</small>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('QRコード生成エラー:', error);
                qrCodeHTML = `
                    <div class="qr-code error" style="width: 60px; height: 60px; border-radius: 6px; background: #fee; padding: 4px; border: 1px solid #fcc; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #c33; font-size: 0.6rem; text-align: center; margin-left: 10px;">
                        <span>QR生成エラー</span>
                        <small>${data.qrUrl}</small>
                        <small>${error.message}</small>
                    </div>
                `;
            }
        } else {
            console.log('QRコード生成をスキップ: URLが空');
        }
        
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
                    
                    <div class="card-footer">
                        <div class="footer-left">
                            <p class="card-address">${this.escapeHtml(data.address)}</p>
                        </div>
                        <div class="footer-right">
                            ${qrCodeHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // QRコード生成関数
    async generateQRCode(text, size = 200) {
        console.log('QRコード生成開始:', text);
        
        if (!text || text.trim() === '') {
            console.log('QRコード生成をスキップ: テキストが空');
            return null;
        }
        
        // 1. QRGenライブラリを試行
        if (typeof window.generateQRGenQRCode === 'function') {
            try {
                console.log('QRGenライブラリでQRコード生成を試行');
                const qrCode = await window.generateQRGenQRCode(text, size);
                console.log('✅ QRGen QRコード生成成功');
                return qrCode;
            } catch (error) {
                console.warn('QRGen QRコード生成に失敗:', error);
            }
        }
        
        // 2. QRCode.jsライブラリを試行
        if (typeof window.generateQRCodeJS === 'function') {
            try {
                console.log('QRCode.jsライブラリでQRコード生成を試行');
                const qrCode = await window.generateQRCodeJS(text, size);
                console.log('✅ QRCode.js QRコード生成成功');
                return qrCode;
            } catch (error) {
                console.warn('QRCode.js QRコード生成に失敗:', error);
            }
        }
        
        // 3. シンプルQRコードを試行
        if (typeof window.generateSimpleQRCode === 'function') {
            try {
                console.log('シンプルQRコード生成を試行');
                const qrCode = await window.generateSimpleQRCode(text, size);
                console.log('✅ シンプルQRコード生成成功');
                return qrCode;
            } catch (error) {
                console.warn('シンプルQRコード生成に失敗:', error);
            }
        }
        
        console.error('❌ すべてのQRコード生成方法に失敗');
        return null;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async downloadCard() {
        try {
            const cardData = this.getFormData();
            const htmlContent = await this.generateCompleteHTML(cardData);
            
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

    async generateCompleteHTML(data) {
        const template = data.template;
        const color = data.color;
        
        // QRコードを生成
        let qrCodeHTML = '';
        if (data.qrUrl && data.qrUrl.trim() !== '') {
            try {
                const qrCodeDataURL = await this.generateQRCode(data.qrUrl, 60);
                
                if (qrCodeDataURL) {
                    qrCodeHTML = `
                        <div class="qr-code" style="width: 60px; height: 60px; border-radius: 6px; background: white; padding: 4px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); flex-shrink: 0; border: 1px solid #e0e0e0; display: block; position: relative; margin-left: 10px;">
                            <img src="${qrCodeDataURL}" alt="QR Code" title="QR Code for ${data.qrUrl}" style="width: 100%; height: 100%; border-radius: 3px; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; display: block; object-fit: contain;">
                        </div>
                    `;
                } else {
                    qrCodeHTML = `
                        <div class="qr-code error" style="width: 60px; height: 60px; border-radius: 6px; background: #fee; padding: 4px; border: 1px solid #fcc; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #c33; font-size: 0.6rem; text-align: center; margin-left: 10px;">
                            <span>QR生成エラー</span>
                            <small>${data.qrUrl}</small>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('QRコード生成エラー:', error);
                qrCodeHTML = `
                    <div class="qr-code error" style="width: 60px; height: 60px; border-radius: 6px; background: #fee; padding: 4px; border: 1px solid #fcc; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #c33; font-size: 0.6rem; text-align: center; margin-left: 10px;">
                        <span>QR生成エラー</span>
                        <small>${data.qrUrl}</small>
                        <small>${error.message}</small>
                    </div>
                `;
            }
        }
        
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
            width: 400px;
            height: 250px;
            border-radius: 15px;
            padding: 25px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
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
            gap: 4px;
            position: relative;
            z-index: 1;
        }
        
        .card-header {
            margin-bottom: 0;
        }
        
        .card-name {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 6px;
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
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 4px;
            color: #495057;
            line-height: 1.2;
        }
        
        .business-card.modern .card-company,
        .business-card.creative .card-company {
            color: rgba(255, 255, 255, 0.9);
        }
        
        .card-position {
            font-size: 1rem;
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
            font-size: 0.9rem;
            margin-bottom: 2px;
            color: #495057;
            display: flex;
            align-items: center;
            gap: 6px;
            line-height: 1.3;
        }
        
        .card-contact p:last-child {
            margin-bottom: 0;
        }
        
        .business-card.modern .card-contact p,
        .business-card.creative .card-contact p {
            color: rgba(255, 255, 255, 0.9);
        }
        
        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 4px;
            gap: 10px;
            padding-top: 4px;
        }
        .footer-left {
            flex: 1 1 0;
            min-width: 0;
        }
        .footer-right {
            display: flex;
            align-items: flex-end;
        }
        .card-address {
            font-size: 0.8rem;
            color: #777;
            line-height: 1.3;
            font-weight: 500;
            margin: 0;
            word-break: break-word;
            white-space: normal;
        }
        
        .business-card.modern .card-address,
        .business-card.creative .card-address {
            color: rgba(255, 255, 255, 0.8);
        }
        
        .qr-code {
            width: 60px;
            height: 60px;
            border-radius: 6px;
            background: white;
            padding: 4px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            flex-shrink: 0;
            border: 1px solid #e0e0e0;
        }
        
        .qr-code img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: pixelated;
        }
        
        .qr-code.error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            font-size: 0.6rem;
            text-align: center;
            padding: 4px;
            min-height: 60px;
        }
        
        .qr-code.error span {
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .qr-code.error small {
            font-size: 0.6rem;
            word-break: break-all;
            opacity: 0.8;
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
            
            <div class="card-footer">
                <div class="footer-left">
                    <p class="card-address">${this.escapeHtml(data.address)}</p>
                </div>
                <div class="footer-right">
                    ${qrCodeHTML}
                </div>
            </div>
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

    // サンプルデータでフォームを埋める
    fillSampleData() {
        this.nameInput.value = '田中花子';
        this.companyInput.value = 'テック株式会社';
        this.positionInput.value = 'Webデザイナー';
        this.phoneInput.value = '090-1234-5678';
        this.emailInput.value = 'tanaka@tech.co.jp';
        this.addressInput.value = '〒150-0043 東京都渋谷区道玄坂1-1-1';
        this.websiteInput.value = 'www.tech.co.jp';
        this.qrUrlInput.value = 'https://www.tech.co.jp';
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

    async downloadCardImage(width, height) {
        const card = this.previewContainer.querySelector('.business-card');
        if (!card) {
            this.showNotification('名刺が見つかりません', 'error');
            return;
        }
        // 一時的に拡大用のラッパーを作成
        const wrapper = document.createElement('div');
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.background = '#fff';
        wrapper.appendChild(card.cloneNode(true));
        document.body.appendChild(wrapper);
        // 画像化
        await html2canvas(wrapper, {width, height, backgroundColor: '#fff', scale: 1}).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `business-card-bg-${width}x${height}.png`;
            link.click();
        });
        document.body.removeChild(wrapper);
        this.showNotification(`${width}x${height}画像をダウンロードしました`, 'success');
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const app = new BusinessCardApp();
    
    // グローバルにアクセス可能にする
    window.businessCardApp = app;
    
    console.log('FanLinkアプリが起動しました（QRGen QRコード生成使用）。');
    console.log('QRGen QRテスト: 「QRGen QRテスト」ボタンをクリックしてください。');
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
