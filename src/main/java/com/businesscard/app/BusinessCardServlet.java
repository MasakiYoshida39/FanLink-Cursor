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
                // 無視
            }
            if (photoPart != null && photoPart.getSize() > 0) {
                byte[] photoBytes = photoPart.getInputStream().readAllBytes();
                photoBase64 = Base64.getEncoder().encodeToString(photoBytes);
            }

            // multipart/form-dataの場合はgetParameterで取得
            String name = request.getParameter("name");
            String company = request.getParameter("company");
            String position = request.getParameter("position");
            String phone = request.getParameter("phone");
            String email = request.getParameter("email");
            String address = request.getParameter("address");
            String website = request.getParameter("website");
            String template = request.getParameter("template");
            String color = request.getParameter("color");

            // nullの場合はデフォルト値
            if (name == null) name = "山田太郎";
            if (company == null) company = "株式会社サンプル";
            if (position == null) position = "営業部長";
            if (phone == null) phone = "03-1234-5678";
            if (email == null) email = "yamada@sample.com";
            if (address == null) address = "〒100-0001 東京都千代田区千代田1-1-1";
            if (website == null) website = "www.sample.com";
            if (template == null) template = "classic";
            if (color == null) color = "blue";

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
        html.append("        * { margin: 0; padding: 0; box-sizing: border-box; }\n");
        html.append("        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }\n");
        html.append("        .business-card { width: 400px; height: 250px; border-radius: 15px; padding: 25px; position: relative; overflow: hidden; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease; }\n");
        html.append("        .business-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%); pointer-events: none; }\n");
        html.append("        .business-card.classic { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 2px solid #e9ecef; }\n");
        html.append("        .business-card.modern { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }\n");
        html.append("        .business-card.minimal { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 1px solid #dee2e6; }\n");
        html.append("        .business-card.creative { background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); }\n");
        html.append("        .business-card.blue { border-left: 5px solid #667eea; box-shadow: 0 15px 30px rgba(102, 126, 234, 0.15); }\n");
        html.append("        .business-card.green { border-left: 5px solid #28a745; box-shadow: 0 15px 30px rgba(72, 187, 120, 0.15); }\n");
        html.append("        .business-card.red { border-left: 5px solid #dc3545; box-shadow: 0 15px 30px rgba(245, 101, 101, 0.15); }\n");
        html.append("        .business-card.purple { border-left: 5px solid #6f42c1; box-shadow: 0 15px 30px rgba(159, 122, 234, 0.15); }\n");
        html.append("        .business-card.orange { border-left: 5px solid #fd7e14; box-shadow: 0 15px 30px rgba(237, 137, 54, 0.15); }\n");
        html.append("        .card-content { height: 100%; display: flex; flex-direction: column; justify-content: flex-start; gap: 4px; position: relative; z-index: 1; }\n");
        html.append("        .card-header { margin-bottom: 0; display: flex; align-items: center; gap: 8px; }\n");
        html.append("        .card-name { font-size: 1.8rem; font-weight: 700; margin-bottom: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2; }\n");
        html.append("        .business-card.modern .card-name, .business-card.creative .card-name { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }\n");
        html.append("        .card-company { font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; color: #495057; line-height: 1.2; }\n");
        html.append("        .business-card.modern .card-company, .business-card.creative .card-company { color: rgba(255, 255, 255, 0.9); }\n");
        html.append("        .card-position { font-size: 1rem; color: #6c757d; margin-bottom: 0; font-weight: 500; line-height: 1.2; }\n");
        html.append("        .business-card.modern .card-position, .business-card.creative .card-position { color: rgba(255, 255, 255, 0.8); }\n");
        html.append("        .card-contact { margin-bottom: 0; }\n");
        html.append("        .card-contact p { font-size: 0.9rem; margin-bottom: 2px; color: #495057; display: flex; align-items: center; gap: 6px; line-height: 1.3; }\n");
        html.append("        .card-contact p:last-child { margin-bottom: 0; }\n");
        html.append("        .business-card.modern .card-contact p, .business-card.creative .card-contact p { color: rgba(255, 255, 255, 0.9); }\n");
        html.append("        .card-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px; gap: 10px; padding-top: 4px; }\n");
        html.append("        .footer-left { flex: 1 1 0; min-width: 0; }\n");
        html.append("        .footer-right { display: flex; align-items: flex-end; }\n");
        html.append("        .card-address { font-size: 0.8rem; color: #777; line-height: 1.3; font-weight: 500; margin: 0; word-break: break-word; white-space: normal; }\n");
        html.append("        .business-card.modern .card-address, .business-card.creative .card-address { color: rgba(255, 255, 255, 0.8); }\n");
        html.append("        @media print { body { background: white; padding: 0; } .business-card { box-shadow: none; border: 1px solid #ddd; } }\n");
        html.append("    </style>\n");
        html.append("</head>\n");
        html.append("<body>\n");
        html.append("    <div class=\"business-card ").append(template).append(" ").append(color).append("\">\n");
        html.append("        <div class=\"card-content\">\n");
        html.append("            <div class=\"card-header\">\n");
        html.append("                <h3 class=\"card-name\" style=\"margin-bottom:0;\">").append(escapeHtml(name)).append("</h3>\n");
        if (photoBase64 != null && !photoBase64.isEmpty()) {
            html.append("                <img src=\"data:image/png;base64,").append(photoBase64).append("\" alt=\"写真\" style=\"width:48px; height:48px; object-fit:cover; border-radius:50%; display:block;\">");
        }
        html.append("            </div>\n");
        if (!company.isEmpty()) {
            html.append("            <p class=\"card-company\">").append(escapeHtml(company)).append("</p>\n");
        }
        if (!position.isEmpty()) {
            html.append("            <p class=\"card-position\">").append(escapeHtml(position)).append("</p>\n");
        }
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
        html.append("            <div class=\"card-footer\">\n");
        html.append("                <div class=\"footer-left\">\n");
        if (!address.isEmpty()) {
            html.append("                    <p class=\"card-address\">").append(escapeHtml(address)).append("</p>\n");
        }
        html.append("                </div>\n");
        html.append("                <div class=\"footer-right\">\n");
        html.append("                </div>\n");
        html.append("            </div>\n");
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