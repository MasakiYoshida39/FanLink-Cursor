package com.businesscard.app;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Base64;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

@WebServlet("/upload")
public class UploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");

        Part photoPart = request.getPart("photo");
        String name = request.getParameter("name");
        String company = request.getParameter("company");
        String position = request.getParameter("position");

        String photoBase64 = "";
        if (photoPart != null && photoPart.getSize() > 0) {
            try (InputStream is = photoPart.getInputStream()) {
                byte[] bytes = is.readAllBytes();
                String mimeType = photoPart.getContentType();
                photoBase64 = "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(bytes);
            }
        }

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html><html lang=\"ja\"><head><meta charset=\"UTF-8\"><title>名刺プレビュー</title></head><body>");
        out.println("<h2>名刺プレビュー</h2>");
        out.println("<div style='border:1px solid #ccc; padding:20px; width:350px;'>");
        if (!photoBase64.isEmpty()) {
            out.println("<img src='" + photoBase64 + "' alt='顔写真' style='width:80px;height:80px;border-radius:50%;object-fit:cover;'><br>");
        }
        out.println("<strong>氏名:</strong> " + (name != null ? name : "") + "<br>");
        out.println("<strong>会社名:</strong> " + (company != null ? company : "") + "<br>");
        out.println("<strong>役職:</strong> " + (position != null ? position : "") + "<br>");
        out.println("</div>");
        out.println("<br><a href='index.html'>戻る</a>");
        out.println("</body></html>");
    }
}