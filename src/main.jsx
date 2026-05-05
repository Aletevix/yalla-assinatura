import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import yallaLogoUrl from './assets/yalla_logo.webp';
import './styles.css';

const ADDR = 'Av. Washington Luís, 6675 . Sala 703 . Vila Congonhas, São Paulo';
const TEL = '0800 080 0144';
const SITE = 'www.yallacar.com.br';
const OFFICIAL_LOGO_URL = 'https://yallacar.com.br/_next/image?q=75&url=%2Fimages%2Fimage-26.webp&w=384';

const SOCIALS = [
  { name: 'Facebook', url: 'https://www.facebook.com/yallacaar/?locale=pt_BR', color: '#1877F2', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', stroke: false },
  { name: 'Instagram', url: 'https://www.instagram.com/yallaalugueldecarros/', color: '#E1306C', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z', stroke: true },
  { name: 'YouTube', url: 'https://www.youtube.com/@SempreYalla', color: '#FF0000', path: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98l5.75 3.02-5.75 3.02z', stroke: false },
  { name: 'TikTok', url: 'https://www.tiktok.com/@yallacarlocadora', color: '#000000', path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z', stroke: false },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/yallaalugueldecarros/?originalSubdomain=br', color: '#0A66C2', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', stroke: false },
];

const INITIAL_FORM = {
  nome: '',
  cargo: '',
  frase: '',
  email: '',
  whats: '',
  foto: '',
  fotoFileName: '',
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function svgIcon(social) {
  const common = `xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"`;

  if (social.stroke) {
    return `<svg ${common} fill="none" stroke="${social.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${social.path}"/></svg>`;
  }

  return `<svg ${common} fill="${social.color}"><path d="${social.path}"/></svg>`;
}

function getInitials(nome) {
  return nome.trim().split(' ').map((word) => word[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
}

function buildSig(fields) {
  const nomeRaw = fields.nome || 'Seu Nome';
  const cargoRaw = fields.cargo || 'Seu Cargo';
  const emailRaw = fields.email || 'email@int.yallacar.com.br';
  const whatsRaw = fields.whats || '(11) 9 0000-0000';

  const nome = escapeHtml(nomeRaw);
  const cargo = escapeHtml(cargoRaw);
  const frase = escapeHtml(fields.frase);
  const email = escapeHtml(emailRaw);
  const whats = escapeHtml(whatsRaw);
  const foto = escapeHtml(fields.foto);

  const fotoHtml = foto
    ? `<img src="${foto}" width="80" height="80" alt="${nome}" style="border-radius:50%;object-fit:cover;display:block;">`
    : `<div style="width:80px;height:80px;border-radius:50%;background:#1B2D5B;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">${getInitials(nomeRaw)}</div>`;

  const socialsBtns = SOCIALS.map((social) =>
    `<a href="${social.url}" target="_blank" aria-label="${social.name}" style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#fff;margin-right:3px;vertical-align:middle;text-decoration:none;">${svgIcon(social)}</a>`,
  ).join('');

  const fraseHtml = frase
    ? `<br><em style="color:#888888;font-size:12px;font-style:italic;">${frase}</em>`
    : '';

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;max-width:600px;width:100%;background:#ffffff;">
  <tr>
    <td colspan="3" style="background:#1B2D5B;height:5px;border-radius:4px 4px 0 0;font-size:0;">&nbsp;</td>
  </tr>
  <tr>
    <td style="padding:16px 12px 16px 16px;vertical-align:middle;width:96px;">
      ${fotoHtml}
    </td>
    <td style="padding:16px 14px;vertical-align:middle;border-right:3px solid #F5A623;white-space:nowrap;">
      <strong style="font-size:14px;color:#1B2D5B;display:block;margin-bottom:3px;">${nome}</strong>
      <span style="color:#666666;font-size:12px;">${cargo}</span>
      ${fraseHtml}
    </td>
    <td style="padding:16px 20px 16px 20px;vertical-align:middle;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding-bottom:6px;white-space:nowrap;">
          <span style="font-size:14px;">&#128205;</span>&nbsp;<span style="color:#555555;font-size:12px;">${ADDR}</span>
        </td></tr>
        <tr><td style="padding-bottom:6px;white-space:nowrap;">
          <span style="font-size:14px;">&#128241;</span>&nbsp;<span style="color:#555555;font-size:12px;">${whats}</span>
        </td></tr>
        <tr><td style="padding-bottom:6px;white-space:nowrap;">
          <span style="font-size:14px;">&#128222;</span>&nbsp;<span style="color:#555555;font-size:12px;">${TEL}</span>
        </td></tr>
        <tr><td style="white-space:nowrap;">
          <span style="font-size:14px;">&#9993;</span>&nbsp;<a href="mailto:${email}" style="color:#1B2D5B;font-size:12px;text-decoration:none;">${email}</a>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="background:#1B2D5B;padding:8px 16px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:middle;">
            <span style="color:#aaaacc;font-size:11px;margin-right:4px;">Nossas redes:</span>
            ${socialsBtns}
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <img src="${OFFICIAL_LOGO_URL}" alt="Yalla Logo" height="36" style="display:inline-block;border:0;">
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="background:#F5A623;padding:6px 16px;border-radius:0 0 4px 4px;">
      <a href="https://${SITE}" style="color:#ffffff;font-size:12px;text-decoration:none;font-weight:700;">${SITE}</a>
    </td>
  </tr>
</table>`;
}

function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [toastVisible, setToastVisible] = useState(false);
  const fileInputRef = useRef(null);
  const signatureHtml = useMemo(() => buildSig(form), [form]);
  const initials = useMemo(() => getInitials(form.nome), [form.nome]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updatePhotoUrl(value) {
    setForm((current) => ({ ...current, foto: value, fotoFileName: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        foto: String(reader.result),
        fotoFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  }

  function removeFoto() {
    setForm((current) => ({ ...current, foto: '', fotoFileName: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function showToast() {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 4000);
  }

  async function copyHTML() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(signatureHtml);
      showToast();
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = signatureHtml;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast();
  }

  function downloadHTML() {
    const filename = `assinatura-${(form.nome || 'yalla').toLowerCase().trim().replace(/\s+/g, '-')}.html`;
    const fullHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Assinatura ${escapeHtml(form.nome || 'Yalla')}</title></head><body style="margin:0;padding:20px;background:#f0f0f0;">${signatureHtml}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  return (
    <>
      <header className="app-header">
        <div className="logo" aria-label="Yalla">
          <img src={yallaLogoUrl} alt="Yalla Logo" height="40" />
        </div>
        <div className="header-badge">Gerador de Assinatura de E-mail</div>
      </header>

      <main className="layout">
        <section className="panel">
          <div className="panel-header"><span className="dot" /> Seus dados</div>
          <div className="panel-body">
            <div className="section-label">Identificacao</div>

            <Field label="Nome completo" value={form.nome} placeholder="Ex: Leonardo Fava" onChange={(value) => updateField('nome', value)} />
            <Field label="Cargo" value={form.cargo} placeholder="Ex: Cargo Financeiro" onChange={(value) => updateField('cargo', value)} />
            <Field label="Frase motivacional (opcional)" value={form.frase} placeholder={'Ex: "Sempre em frente".'} onChange={(value) => updateField('frase', value)} />

            <div className="section-label">Contato</div>

            <Field label="E-mail" type="email" value={form.email} placeholder="nome@int.yallacar.com.br" onChange={(value) => updateField('email', value)} />
            <Field label="WhatsApp" value={form.whats} placeholder="(11) 9 0000-0000" onChange={(value) => updateField('whats', value)} />

            <div className="section-label">Foto</div>

            <div className="field">
              <label htmlFor="photo-url">Foto do perfil</label>
              <div className="photo-input-wrap">
                <input
                  id="photo-url"
                  type="text"
                  value={form.foto}
                  placeholder="https://... ou use o botao abaixo"
                  onChange={(event) => updatePhotoUrl(event.target.value)}
                />
                <div className="photo-preview" aria-hidden="true">
                  {form.foto ? <img src={form.foto} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <span>{initials}</span>}
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="file-input" onChange={handleFileUpload} />
              <button className="btn-upload" type="button" onClick={() => fileInputRef.current?.click()}>
                &#128193; Buscar foto do computador
              </button>
              {form.fotoFileName && (
                <div className="foto-file-info">
                  <span>{form.fotoFileName}</span>
                  <button className="remove-foto" type="button" onClick={removeFoto} title="Remover foto">&#10005;</button>
                </div>
              )}
            </div>

            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={copyHTML}>Copiar HTML</button>
              <button className="btn btn-gold" type="button" onClick={downloadHTML}>Baixar .html</button>
            </div>

            <div className={`copy-toast ${toastVisible ? 'is-visible' : ''}`}>HTML copiado! Cole no editor de assinatura do seu e-mail.</div>
          </div>
        </section>

        <section className="right-col">
          <div className="preview-box">
            <div className="preview-title">Previa da assinatura</div>
            <div id="sig-preview" dangerouslySetInnerHTML={{ __html: signatureHtml }} />
          </div>

          <div className="code-panel">
            <div className="code-header">
              <span>assinatura.html</span>
              <button className="code-copy-btn" type="button" onClick={copyHTML}>Copiar codigo</button>
            </div>
            <pre id="code-output">{signatureHtml}</pre>
          </div>

          <div className="how-to">
            <h3>Como usar no seu e-mail</h3>
            <ol className="steps">
              <Step number="1">Preencha seus dados ao lado e copie o HTML</Step>
              <Step number="2"><strong>Gmail:</strong> Configuracoes, Ver todas, Assinatura, colar no modo HTML</Step>
              <Step number="3"><strong>Outlook:</strong> Arquivo, Opcoes, Email, Assinaturas, Novo, colar HTML</Step>
              <Step number="4">Salve e envie um e-mail de teste para conferir</Step>
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function Step({ number, children }) {
  return (
    <li>
      <span className="step-num">{number}</span>
      <span>{children}</span>
    </li>
  );
}

createRoot(document.getElementById('root')).render(<App />);
