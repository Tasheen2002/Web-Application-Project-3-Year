import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `${process.env.FROM_NAME || 'E-Commerce'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  const message = `
    Welcome to our E-Commerce Platform!

    Dear ${user.name},

    Thank you for joining our platform. We're excited to have you as part of our community.

    Best regards,
    The E-Commerce Team
  `;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to our E-Commerce Platform!</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Thank you for joining our platform. We're excited to have you as part of our community.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse our wide selection of products</li>
        <li>Add items to your wishlist</li>
        <li>Enjoy secure checkout</li>
        <li>Track your orders</li>
      </ul>
      <p>Best regards,<br>The E-Commerce Team</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Welcome to E-Commerce Platform',
    message,
    html: htmlMessage
  });
};

export const sendOrderConfirmationEmail = async (user, order) => {
  const message = `
    Order Confirmation

    Dear ${user.name},

    Your order #${order._id} has been confirmed.

    Order Total: $${order.totalPrice}

    We'll send you updates as your order is processed.

    Best regards,
    The E-Commerce Team
  `;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Your order <strong>#${order._id}</strong> has been confirmed.</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order Total:</strong> $${order.totalPrice}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      </div>
      <p>We'll send you updates as your order is processed.</p>
      <p>Best regards,<br>The E-Commerce Team</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - #${order._id}`,
    message,
    html: htmlMessage
  });
};

export const sendOrderStatusUpdateEmail = async (user, order, status) => {
  const statusMessages = {
    processing: 'Your order is now being processed.',
    shipped: 'Your order has been shipped!',
    delivered: 'Your order has been delivered.',
    cancelled: 'Your order has been cancelled.'
  };

  const message = `
    Order Status Update

    Dear ${user.name},

    Your order #${order._id} status has been updated.

    Status: ${status.toUpperCase()}
    ${statusMessages[status] || ''}

    ${order.trackingNumber ? `Tracking Number: ${order.trackingNumber}` : ''}

    Best regards,
    The E-Commerce Team
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Update - #${order._id}`,
    message
  });
};