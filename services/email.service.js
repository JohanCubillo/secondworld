const { Resend } = require('resend');
const { config } = require('../config/config');

const resend = new Resend(config.resendApiKey);

class EmailService {
  async sendOrderConfirmation(order) {
    try {
      const trackingUrl = `http://localhost:8080/order-confirmation.html?token=${order.trackingToken}`;
      
      const { data, error } = await resend.emails.send({
        from: 'SecondStyle <onboarding@resend.dev>', // Cambia esto cuando tengas tu dominio
        to: [order.customerEmail],
        subject: `✅ Orden Confirmada #${order.id} - SecondStyle`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
              .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; color: #999; padding: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 ¡Gracias por tu compra!</h1>
                <p>Tu orden ha sido recibida exitosamente</p>
              </div>
              
              <div class="content">
                <h2>Hola ${order.customerName},</h2>
                <p>Tu orden <strong>#${order.id}</strong> ha sido confirmada y está siendo procesada.</p>
                
                <div class="order-details">
                  <h3>📦 Detalles de tu Orden</h3>
                  <p><strong>Número de Orden:</strong> #${order.id}</p>
                  <p><strong>Total:</strong> ₡${parseFloat(order.total).toFixed(2)}</p>
                  <p><strong>Estado:</strong> Pendiente de verificación de pago</p>
                </div>
                
                <p>Puedes rastrear tu orden en cualquier momento haciendo clic en el botón:</p>
                
                <center>
                  <a href="${trackingUrl}" class="button">🔍 Rastrear mi Orden</a>
                </center>
                
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                  O copia este enlace en tu navegador:<br>
                  <a href="${trackingUrl}">${trackingUrl}</a>
                </p>
                
                <div class="order-details">
                  <h3>📍 Dirección de Envío</h3>
                  <p>
                    ${order.shippingProvince}, ${order.shippingCanton}, ${order.shippingDistrict}<br>
                    ${order.shippingAddress}
                  </p>
                </div>
                
                <p><strong>Próximos pasos:</strong></p>
                <ol>
                  <li>Verificaremos tu pago SINPE</li>
                  <li>Prepararemos tu pedido</li>
                  <li>Lo enviaremos a tu dirección</li>
                  <li>Recibirás un código de rastreo de Correos de Costa Rica</li>
                </ol>
              </div>
              
              <div class="footer">
                <p>SecondStyle - Moda de Segunda Mano</p>
                <p>Este es un email automático, por favor no respondas a este mensaje.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('Error enviando email:', error);
        return { success: false, error };
      }

      console.log('✅ Email enviado exitosamente:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error en sendOrderConfirmation:', error);
      return { success: false, error };
    }
  }
}

module.exports = EmailService;