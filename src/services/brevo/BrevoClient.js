// ---------------------------------------------------------------------------
// BrevoClient — Thin HTTP client for Brevo Transactional Email API
// ---------------------------------------------------------------------------
// Endpoints used:
//   GET  https://api.brevo.com/v3/smtp/templates/{id}  — verify template
//   POST https://api.brevo.com/v3/smtp/email            — send transactional
// ---------------------------------------------------------------------------

const BREVO_API_BASE = 'https://api.brevo.com/v3';

/**
 * Classifies an HTTP status code into a failure type.
 * @param {number} status
 * @returns {'permanent'|'transient'|'success'}
 */
function classifyError(status) {
  if (status >= 200 && status < 300) return 'success';
  if (status === 429 || status >= 500) return 'transient';
  return 'permanent'; // 400, 401, 403, 404, etc.
}

export class BrevoClient {
  /**
   * @param {string} apiKey - Brevo API key (server-side only)
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('[BrevoClient] API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Fetches template details from the Brevo Transactional API.
   * @param {number} templateId
   * @returns {Promise<{success: boolean, template?: object, error?: string, errorType?: string}>}
   */
  async getTemplate(templateId) {
    try {
      const res = await fetch(`${BREVO_API_BASE}/smtp/templates/${templateId}`, {
        method: 'GET',
        headers: {
          'api-key': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errorType = classifyError(res.status);
        const body = await res.text().catch(() => '');
        return {
          success: false,
          error: `Brevo API returned ${res.status}: ${body}`,
          errorType,
          status: res.status
        };
      }

      const template = await res.json();
      return { success: true, template };
    } catch (err) {
      return {
        success: false,
        error: `Network error: ${err.message}`,
        errorType: 'transient'
      };
    }
  }

  /**
   * Sends a transactional email via Brevo.
   * @param {Object} params
   * @param {number} params.templateId
   * @param {Array<{email: string, name?: string}>} params.to
   * @param {Object} params.params - Template personalization parameters
   * @param {Object} [params.sender] - Optional sender override
   * @returns {Promise<{success: boolean, messageId?: string, error?: string, errorType?: string}>}
   */
  async sendTransactionalEmail({ templateId, to, params, sender }) {
    const body = {
      templateId,
      to,
      params: params || {}
    };

    if (sender) {
      body.sender = sender;
    }

    try {
      const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorType = classifyError(res.status);
        let errorMsg;
        try {
          const errBody = await res.json();
          errorMsg = errBody.message || errBody.error || JSON.stringify(errBody);
        } catch {
          errorMsg = `HTTP ${res.status}`;
        }
        return {
          success: false,
          error: `Brevo send failed (${res.status}): ${errorMsg}`,
          errorType,
          status: res.status
        };
      }

      const data = await res.json();
      return {
        success: true,
        messageId: data.messageId || data.messageIds?.[0] || null
      };
    } catch (err) {
      return {
        success: false,
        error: `Network error sending email: ${err.message}`,
        errorType: 'transient'
      };
    }
  }
}

export default BrevoClient;
