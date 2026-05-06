import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import yallaLogoUrl from './assets/yalla_logo.webp';
import './styles.css';

const ADDR = 'Av. Washington Luís, 6675 . Sala 703 . Vila Congonhas, São Paulo';
const TEL = '0800 504 0162';
const SITE = 'www.yallacar.com.br';
const OFFICIAL_LOGO_URL = 'https://yallacar.com.br/_next/image?q=75&url=%2Fimages%2Fimage-26.webp&w=384';

const SOCIALS = [
  { name: 'Facebook',  url: 'https://www.facebook.com/yallacaar/?locale=pt_BR',                          color: '#1877F2', label: 'f'  },
  { name: 'Instagram', url: 'https://www.instagram.com/yallaalugueldecarros/',                            color: '#E1306C', label: 'ig' },
  { name: 'YouTube',   url: 'https://www.youtube.com/@SempreYalla',                                       color: '#FF0000', label: 'yt' },
  { name: 'TikTok',    url: 'https://www.tiktok.com/@yallacarlocadora',                                   color: '#010101', label: 'tt' },
  { name: 'LinkedIn',  url: 'https://www.linkedin.com/company/yallaalugueldecarros/?originalSubdomain=br', color: '#0A66C2', label: 'in' },
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

function createIconDataUrl(color, label) {
  try {
    const size = 36;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${label.length > 1 ? 12 : 16}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label.toUpperCase(), size / 2, size / 2 + 1);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

function socialBadge(social, iconUrl) {
  const icon = iconUrl
    ? `<img src="${iconUrl}" width="30" height="30" alt="${social.name}" style="display:block;border:0;">`
    : `<span style="display:block;width:30px;height:30px;background:${social.color};border-radius:15px;text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#fff;">${social.label}</span>`;
  return `<td style="padding:0 5px 0 0;">` +
    `<a href="${social.url}" target="_blank" aria-label="${social.name}" style="display:block;text-decoration:none;">` +
    icon +
    `</a></td>`;
}

function getInitials(nome) {
  return nome.trim().split(' ').map((word) => word[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
}

function maskWhatsapp(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function buildSig(fields, iconUrls = {}) {
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

  const socialsBtns = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${SOCIALS.map((social) => socialBadge(social, iconUrls[social.name])).join('')}</tr></table>`;

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
  const [toastMsg, setToastMsg] = useState('');
  const [outlookModal, setOutlookModal] = useState(null);
  const [socialIconUrls, setSocialIconUrls] = useState({});
  const fileInputRef = useRef(null);
  const signatureHtml = useMemo(() => buildSig(form, socialIconUrls), [form, socialIconUrls]);
  const initials = useMemo(() => getInitials(form.nome), [form.nome]);

  useEffect(() => {
    const urls = {};
    SOCIALS.forEach((s) => { urls[s.name] = createIconDataUrl(s.color, s.label); });
    setSocialIconUrls(urls);
  }, []);

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

  function showToast(msg) {
    setToastMsg(msg || 'HTML copiado! Cole no editor de assinatura do seu e-mail.');
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

  async function copyFormatted() {
    try {
      const htmlBlob = new Blob([signatureHtml], { type: 'text/html' });
      const textBlob = new Blob([''], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob }),
      ]);
    } catch {
      const el = document.getElementById('sig-preview');
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeAllRanges();
    }
    showToast('Assinatura copiada! Abra o Outlook, va em Assinaturas e cole com Ctrl+V.');
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

  function exportToOutlook() {
    const safeName = (form.nome || 'yalla').toLowerCase().trim().replace(/\s+/g, '-');
    const filename = `assinatura-${safeName}.htm`;
    const blob = new Blob([signatureHtml], { type: 'text/html;charset=utf-8' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    setOutlookModal(filename);
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
            <Field label="WhatsApp" value={form.whats} placeholder="(11) 9 0000-0000" inputMode="numeric" maxLength={16} onChange={(value) => updateField('whats', maskWhatsapp(value))} />

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

            <button className="btn btn-outlook" type="button" onClick={copyFormatted}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle',marginRight:6}}><rect x="2" y="4" width="20" height="16" rx="2" fill="#0078D4"/><path d="M2 8l10 7 10-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Copiar para Outlook
            </button>

            <div className={`copy-toast ${toastVisible ? 'is-visible' : ''}`}>{toastMsg}</div>
            {outlookModal && <OutlookModal filename={outlookModal} onClose={() => setOutlookModal(null)} />}
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

            <div className="how-to-section-label">
              <span className="how-to-badge how-to-badge--outlook">Outlook</span>
            </div>
            <ol className="steps">
              <Step number="1">Preencha seus dados e clique em <strong>Copiar para Outlook</strong></Step>
              <Step number="2">No Outlook va em <strong>Arquivo &#8594; Opcoes &#8594; Email &#8594; Assinaturas</strong></Step>
              <Step number="3">Clique em <strong>Novo</strong>, coloque um nome e confirme</Step>
              <Step number="4">Clique dentro da caixa de texto da assinatura e cole com <strong>Ctrl+V</strong></Step>
              <Step number="5">Clique em <strong>OK</strong> para salvar</Step>
            </ol>

            <div className="how-to-section-label" style={{marginTop: '16px'}}>
              <span className="how-to-badge how-to-badge--gmail">Gmail</span>
            </div>
            <ol className="steps">
              <Step number="1">Preencha seus dados e clique em <strong>Copiar HTML</strong></Step>
              <Step number="2">No Gmail va em <strong>Configuracoes &#8594; Ver todas &#8594; Assinatura</strong></Step>
              <Step number="3">Clique em <strong>Novo</strong>, cole o HTML no modo de edicao e salve</Step>
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', inputMode, maxLength }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
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

function OutlookModal({ filename, onClose }) {
  const [pathCopied, setPathCopied] = useState(false);
  const path = '%APPDATA%\\Microsoft\\Signatures';

  async function copyPath() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(path);
    } else {
      const ta = document.createElement('textarea');
      ta.value = path;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setPathCopied(true);
    window.setTimeout(() => setPathCopied(false), 2500);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">&#10003; Arquivo baixado com sucesso!</span>
          <button className="modal-close" type="button" onClick={onClose}>&#10005;</button>
        </div>
        <div className="modal-body">
          <p className="modal-desc">Siga os passos abaixo para instalar a assinatura no Outlook:</p>
          <ol className="modal-steps">
            <li>
              <span className="modal-step-num">1</span>
              <span>Pressione <kbd>Win</kbd> + <kbd>R</kbd> para abrir o Executar</span>
            </li>
            <li>
              <span className="modal-step-num">2</span>
              <span>
                Digite o caminho abaixo e pressione <kbd>Enter</kbd>:
                <div className="modal-path-row">
                  <code className="modal-path">{path}</code>
                  <button className="modal-copy-path" type="button" onClick={copyPath}>
                    {pathCopied ? '&#10003; Copiado' : 'Copiar'}
                  </button>
                </div>
              </span>
            </li>
            <li>
              <span className="modal-step-num">3</span>
              <span>Mova o arquivo <strong>{filename}</strong> para essa pasta</span>
            </li>
            <li>
              <span className="modal-step-num">4</span>
              <span>Abra o Outlook &#8594; <strong>Arquivo &#8594; Opções &#8594; Email &#8594; Assinaturas</strong></span>
            </li>
            <li>
              <span className="modal-step-num">5</span>
              <span>Selecione a assinatura e clique em <strong>OK</strong></span>
            </li>
          </ol>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" type="button" onClick={onClose}>Entendido</button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
