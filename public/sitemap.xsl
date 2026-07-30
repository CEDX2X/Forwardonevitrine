<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1998/Math/XSLTransform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
      <head>
        <title>Sitemap XML — Forward One Global (Marketing Digital &amp; Événementiel)</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0c0c28;
            color: #e2e8f0;
            line-height: 1.6;
            padding: 30px 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #141446 0%, #1a1a5c 100%);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
          }
          .brand-box {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .brand-logo {
            width: 52px;
            height: 52px;
            background: #10103a;
            border-radius: 12px;
            padding: 8px;
            border: 1px solid rgba(0,194,194,0.3);
          }
          .brand-title {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
          }
          .brand-title span {
            color: #00C2C2;
          }
          .brand-sub {
            font-size: 13px;
            color: #94a3b8;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .badge-seo {
            background: rgba(18, 184, 87, 0.15);
            border: 1px solid #12B857;
            color: #34d399;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .badge-seo::before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #34d399;
            border-radius: 50%;
            box-shadow: 0 0 8px #34d399;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }
          .stat-card {
            background: #141446;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            padding: 20px;
          }
          .stat-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #94a3b8;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .stat-value {
            font-size: 22px;
            font-weight: 800;
            color: #ffffff;
          }
          .stat-value.cyan { color: #00C2C2; }
          .stat-value.green { color: #34d399; }
          .stat-value.purple { color: #a78bfa; }

          .info-banner {
            background: rgba(108, 104, 244, 0.1);
            border-left: 4px solid #6C68F4;
            border-radius: 0 8px 8px 0;
            padding: 16px 20px;
            font-size: 14px;
            color: #cbd5e1;
            margin-bottom: 24px;
          }
          .info-banner strong { color: #ffffff; }

          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #141446;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          }
          th {
            background: #1a1a58;
            color: #00C2C2;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 16px 20px;
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          td {
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            font-size: 14px;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background: rgba(255,255,255,0.02);
          }
          a.url-link {
            color: #38bdf8;
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
          }
          a.url-link:hover {
            text-decoration: underline;
            color: #00C2C2;
          }
          .priority-tag {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
          }
          .p-high { background: rgba(18, 184, 87, 0.2); color: #34d399; border: 1px solid rgba(18, 184, 87, 0.3); }
          .p-med { background: rgba(0, 194, 194, 0.2); color: #38bdf8; border: 1px solid rgba(0, 194, 194, 0.3); }
          .p-low { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.2); }

          .freq-tag {
            color: #cbd5e1;
            font-size: 13px;
            text-transform: capitalize;
          }
          .image-count {
            background: rgba(108, 104, 244, 0.2);
            color: #c4b5fd;
            border: 1px solid rgba(108, 104, 244, 0.4);
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
          }
          .footer a { color: #00C2C2; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          
          <!-- Header -->
          <div class="header">
            <div class="brand-box">
              <img src="/logo-192.png" alt="Forward One" class="brand-logo" />
              <div>
                <div class="brand-title">Forward<span>One</span></div>
                <div class="brand-sub">Progress Without Limits • Douala &amp; Yaoundé</div>
              </div>
            </div>
            <div class="badge-seo">XML Sitemap Optimisé Indexation Google</div>
          </div>

          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total URLs Découvertes</div>
              <div class="stat-value cyan">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> Pages
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Médias &amp; Images Indexés</div>
              <div class="stat-value purple">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url/image:image)"/> Images
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Région Cible &amp; Marché</div>
              <div class="stat-value green">Cameroun 🇨🇲</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Format de Fichier</div>
              <div class="stat-value">Sitemap XML 0.9</div>
            </div>
          </div>

          <!-- Info Banner -->
          <div class="info-banner">
            📌 <strong>À propos de cette page :</strong> Ceci est un plan de site XML (<em>Sitemap XML</em>) généré spécifiquement pour les robots d'indexation des moteurs de recherche tels que <strong>Googlebot</strong>, <strong>Bingbot</strong> et <strong>Yandex</strong>. Il répertorie toutes les pages et ressources multimédias publiques de <strong>Forward One Global</strong>.
          </div>

          <!-- URL Table -->
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL / Emplacement de la Page</th>
                <th>Priorité</th>
                <th>Fréquence</th>
                <th>Images</th>
                <th>Dernière Modif.</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td style="color: #64748b; font-weight: 600;"><xsl:value-of select="position()"/></td>
                  <td>
                    <a class="url-link" href="{sitemap:loc}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:variable name="p" select="sitemap:priority"/>
                    <xsl:choose>
                      <xsl:when test="$p &gt;= 0.9">
                        <span class="priority-tag p-high"><xsl:value-of select="$p"/></span>
                      </xsl:when>
                      <xsl:when test="$p &gt;= 0.7">
                        <span class="priority-tag p-med"><xsl:value-of select="$p"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority-tag p-low"><xsl:value-of select="$p"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td>
                    <span class="freq-tag"><xsl:value-of select="sitemap:changefreq"/></span>
                  </td>
                  <td>
                    <xsl:variable name="imgCount" select="count(image:image)"/>
                    <xsl:choose>
                      <xsl:when test="$imgCount &gt; 0">
                        <span class="image-count">🖼️ <xsl:value-of select="$imgCount"/> image(s)</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span style="color: #64748b;">—</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td style="color: #94a3b8; font-size: 13px;">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <!-- Footer -->
          <div class="footer">
            © 2026 Forward One Global (Cameroun). Tous droits réservés. <a href="https://forwardoneglobal.com/">www.forwardoneglobal.com</a>
          </div>

        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
