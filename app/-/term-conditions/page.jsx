// pages/terms-and-conditions.jsx

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to Sunita Gemstones ! By accessing or purchasing through our website, you agree to comply with the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Product Information</h2>
      <p className="mb-4">
        We strive to ensure all gemstone details, images, and prices are accurate. However, natural gemstones may slightly vary in color, size, and inclusions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Orders and Payments</h2>
      <p className="mb-4">
        All orders must be paid in full at the time of checkout. We accept secure online payments through verified payment gateways. Once confirmed, the order cannot be modified.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Shipping and Delivery</h2>
      <p className="mb-4">
        We ship across India using reputed courier services. Shipping times may vary depending on your location. Estimated delivery is 5–10 business days.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cancellation & Refund Policy</h2>
      <p className="mb-2">
        Orders can be cancelled before they are shipped. Once shipped, cancellation is not possible. 
      </p>
      <p className="mb-4">
        If you're not satisfied with your purchase, you can request a return within 7 days of delivery. Refunds are processed within 5–7 working days after we receive the returned product in its original, unused condition. The amount will be credited back to your original payment method or bank account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Return Eligibility</h2>
      <p className="mb-4">
        Products must be returned in original packaging, unused and undamaged. Custom-made or engraved gemstones are non-refundable.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p className="mb-2">
        For any queries, complaints, or return requests, feel free to contact us:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Phone:</strong> +91-9993409376</li>
        <li><strong>Email:</strong> sunitagemstones@gmail.com</li>
        {/* <li><strong>Address:</strong> [Your Business Address], Jaipur, Rajasthan, India</li> */}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
      <p className="mb-4">
        We are not liable for any indirect, incidental, or consequential damages arising from the use of our services or products beyond the purchase price.
      </p>

      {/* <h2 className="text-xl font-semibold mt-6 mb-2">8. Governing Law</h2>
      <p className="mb-4">
        These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts located in Bhopal, Madhya Pradesh.
      </p> */}
    </div>
  );
}
