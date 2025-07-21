package com.businesscard.app;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.util.Base64;

@jakarta.servlet.annotation.WebServlet("/api/generate-pdf")
@MultipartConfig
public class BusinessCardServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // CORS設定
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        try {
            // リクエストボディを読み取り
            String requestBody = request.getReader().lines().collect(Collectors.joining());
            
            // 画像ファイル取得
            Part photoPart = null;
            String photoBase64 = "";
            try {
                photoPart = request.getPart("photo");
            } catch (Exception e) {
                // JSONリクエストの場合はPartが無いこともあるので無視
            }
            if (photoPart != null && photoPart.getSize() > 0) {
                byte[] photoBytes = photoPart.getInputStream().readAllBytes();
                photoBase64 = Base64.getEncoder().encodeToString(photoBytes);
            }
            
            // シンプルなJSONパース（実際のプロダクションでは適切なJSONライブラリを使用）
            String name = extractJsonValue(requestBody, "name", "山田太郎");
            String company = extractJsonValue(requestBody, "company", "株式会社サンプル");
            String position = extractJsonValue(requestBody, "position", "営業部長");
            String phone = extractJsonValue(requestBody, "phone", "03-1234-5678");
            String email = extractJsonValue(requestBody, "email", "yamada@sample.com");
            String address = extractJsonValue(requestBody, "address", "〒100-0001 東京都千代田区千代田1-1-1");
            String website = extractJsonValue(requestBody, "website", "www.sample.com");
            String template = extractJsonValue(requestBody, "template", "classic");
            String color = extractJsonValue(requestBody, "color", "blue");
            
            // HTMLコンテンツを生成
            String htmlContent = generateHTMLContent(name, company, position, phone, email, address, website, template, color, photoBase64);
            
            // HTMLファイルとしてダウンロード
            response.setContentType("text/html; charset=UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=\"business-card-" + name + ".html\"");
            
            PrintWriter out = response.getWriter();
            out.println(htmlContent);
            out.flush();
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.println("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private String extractJsonValue(String json, String key, String defaultValue) {
        try {
            String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]*)\"";
            java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
            java.util.regex.Matcher m = p.matcher(json);
            if (m.find()) {
                String value = m.group(1);
                return value.isEmpty() ? defaultValue : value;
            }
            return defaultValue;
        } catch (Exception e) {
            return defaultValue;
        }
    }
    
    private String generateHTMLContent(String name, String company, String position, 
                                     String phone, String email, String address, 
                                     String website, String template, String color,
                                     String photoBase64) {
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>\n");
        html.append("<html lang=\"ja\">\n");
        html.append("<head>\n");
        html.append("    <meta charset=\"UTF-8\">\n");
        html.append("    <title>名刺 - ").append(name).append("</title>\n");
        html.append("    <style>\n");
        html.append("        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }\n");
        html.append("        .business-card { width: 350px; height: 200px; border-radius: 10px; padding: 20px; margin: 0 auto; }\n");
        html.append("        .business-card.classic { background: white; border: 2px solid #ddd; }\n");
        html.append("        .business-card.modern { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }\n");
        html.append("        .business-card.minimal { background: #f8f9fa; border: 1px solid #e9ecef; }\n");
        html.append("        .business-card.creative { background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); }\n");
        html.append("        .business-card.blue { border-left: 5px solid #667eea; }\n");
        html.append("        .business-card.green { border-left: 5px solid #28a745; }\n");
        html.append("        .business-card.red { border-left: 5px solid #dc3545; }\n");
        html.append("        .business-card.purple { border-left: 5px solid #6f42c1; }\n");
        html.append("        .business-card.orange { border-left: 5px solid #fd7e14; }\n");
        html.append("        .card-content { height: 100%; display: flex; flex-direction: column; justify-content: space-between; }\n");
        html.append("        .card-header { position: relative; display: flex; align-items: flex-start; gap: 8px; width: 100%; padding-right: 56px; }\n");
        html.append("        .card-header-left { display: flex; flex-direction: column; }\n");
        html.append("        .card-name { font-size: 1.5rem; font-weight: bold; color: #333; margin-bottom: 5px; }\n");
        html.append("        .card-company { font-size: 1.1rem; color: #666; margin-bottom: 5px; }\n");
        html.append("        .card-position { font-size: 1rem; color: #888; margin-bottom: 15px; }\n");
        html.append("        .card-contact { margin-bottom: 10px; }\n");
        html.append("        .card-contact p { font-size: 0.9rem; color: #555; margin-bottom: 3px; }\n");
        html.append("        .card-address { font-size: 0.8rem; color: #777; line-height: 1.4; }\n");
        html.append("        @media print { body { padding: 0; } .business-card { box-shadow: none; } }\n");
        html.append("    </style>\n");
        html.append("</head>\n");
        html.append("<body>\n");
        html.append("    <div class=\"business-card ").append(template).append(" ").append(color).append("\">\n");
        html.append("        <div class=\"card-content\">\n");
        html.append("            <div class=\"card-header\">\n");
        html.append("                <div class=\"card-header-left\">\n");
        html.append("                    <h3 class=\"card-name\" style=\"margin-bottom:0;\">")
            .append(escapeHtml(name)).append("</h3>\n");
        if (!company.isEmpty()) {
            html.append("                    <p class=\"card-company\">").append(escapeHtml(company)).append("</p>\n");
        }
        if (!position.isEmpty()) {
            html.append("                    <p class=\"card-position\">").append(escapeHtml(position)).append("</p>\n");
        }
        html.append("                </div>\n");
        if (photoBase64 != null && !photoBase64.isEmpty()) {
            html.append("                <img src=\"data:image/png;base64,")
                .append(photoBase64)
                .append("\" alt=\"写真\" style=\"width:48px; height:48px; object-fit:cover; border-radius:50%; position:absolute; right:0; top:0; display:block;\">");
        }
        html.append("            </div>\n");
        html.append("            <div class=\"card-contact\">\n");
        if (!phone.isEmpty()) {
            html.append("                <p>📞 ").append(escapeHtml(phone)).append("</p>\n");
        }
        if (!email.isEmpty()) {
            html.append("                <p>📧 ").append(escapeHtml(email)).append("</p>\n");
        }
        if (!website.isEmpty()) {
            html.append("                <p>🌐 ").append(escapeHtml(website)).append("</p>\n");
        }
        html.append("            </div>\n");
        if (!address.isEmpty()) {
            html.append("            <p class=\"card-address\">").append(escapeHtml(address)).append("</p>\n");
        }
        html.append("        </div>\n");
        html.append("    </div>\n");
        html.append("    <script>\n");
        html.append("        window.onload = function() {\n");
        html.append("            setTimeout(function() { window.print(); }, 1000);\n");
        html.append("        };\n");
        html.append("    </script>\n");
        html.append("</body>\n");
        html.append("</html>");
        
        return html.toString();
    }
    
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#39;");
    }
} 