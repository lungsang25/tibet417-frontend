import React from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import SEO from '../components/SEO'

const Clause = ({ number, heading, children }) => (
  <div className='flex flex-col gap-3'>
    <b className='text-gray-800'>{number}. {heading}</b>
    {children}
  </div>
)

const Terms = () => {
  return (
    <div>
      <SEO
        title="Terms & Conditions - Tibet417"
        description="The General Terms and Conditions (GTC) that apply to all orders placed on tibet417.com. Delivery, payment, right of withdrawal, warranty and liability for customers in Switzerland."
        keywords="tibet417 terms and conditions, tibet417 agb, general terms and conditions, right of withdrawal, warranty, swiss online shop terms"
        canonical="https://www.tibet417.com/terms"
      />

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'TERMS &'} text2={'CONDITIONS'} />
      </div>

      <div className='my-10 flex flex-col gap-8 text-sm text-gray-600 max-w-4xl'>

        <div className='border-l-2 border-gray-300 pl-4 flex flex-col gap-2'>
          <p>Version of 10 August 2026</p>
          <p>These General Terms and Conditions were drawn up in German. This English text is a translation provided for convenience only. In the event of any discrepancy between the two versions, the German version shall prevail.</p>
        </div>

        <Clause number='1' heading='Scope of Application'>
          <p>The following General Terms and Conditions (GTC) apply to all orders placed via our website. The offering on this website is directed exclusively at consumers domiciled in Switzerland (hereinafter "Customer").</p>
          <p>A consumer is a natural person who maintains business relations with Tibet417 Fashion that can be attributed neither to their commercial nor to their self-employed professional activity. Orders in quantities that are not customary for a household may be refused without giving reasons.</p>
          <p>Tibet417 Fashion reserves the right to amend these GTC at any time. The version of these GTC in force at the time the order is placed shall be authoritative and cannot be amended unilaterally for that order. Any conflicting terms of the Customer, or terms of the Customer deviating from these GTC, are not recognised.</p>
          <p>The operator of this website is Tibet417 Fashion.</p>
        </Clause>

        <Clause number='2' heading='Information on this Website'>
          <p>Tibet417 Fashion contains information about products and services. Changes to prices and to the product range, as well as technical changes, are reserved. All information on this website (product descriptions, images, illustrations, videos, dimensions, weights, technical specifications, accessory compatibility and other particulars) serves illustrative purposes, is to be understood as approximate, and is non-binding. In particular, it does not constitute any warranty of characteristics or any guarantee, unless expressly stated otherwise. Tibet417 Fashion endeavours to provide all particulars and information on this website in a correct, complete, up-to-date and clearly arranged manner; however, Tibet417 Fashion can give no warranty for this, whether express or implied.</p>
          <p>All offers on this website are non-binding and are not to be understood as a binding offer.</p>
          <p>Tibet417 Fashion cannot guarantee that the listed products will be available at the time the order is placed. All information regarding availability and delivery times is therefore provided without warranty and may change at any time and without prior notice.</p>
        </Clause>

        <Clause number='3' heading='Prices'>
          <p>The sales prices stated on Tibet417 Fashion are final prices and include, unless stated otherwise, any further statutory charges such as advance recycling fees (ARF/VRG) or copyright levies on electronic devices. Prices are strictly net and in Swiss francs (CHF). As a small business, we are exempt from the obligation to charge VAT.</p>
          <p>Any shipping costs will, unless provided otherwise, be charged in addition and are payable by the Customer. Shipping costs are shown separately during the ordering process.</p>
          <p>Technical changes, errors and misprints are reserved; in particular, Tibet417 Fashion may make price changes at any time and without prior notice. The sales prices do not include any advisory or support services.</p>
        </Clause>

        <Clause number='4' heading='Conclusion of Contract'>
          <p>The products and prices on this website constitute non-binding offers.</p>
          <p>By placing an order via this website, including acceptance of these GTC, the Customer submits a legally binding offer to conclude a contract. Tibet417 Fashion thereupon sends an automatic acknowledgement of receipt of the order by email, confirming that the Customer's offer has been received by Tibet417 Fashion. Orders placed are binding on the Customer. Unless stated otherwise, there is no right of return or withdrawal.</p>
          <p>The contract comes into effect as soon as Tibet417 Fashion sends a declaration of acceptance by email confirming the dispatch of the ordered products or services.</p>
          <p>Orders will be delivered only after payment has been received in full (exception: delivery against invoice) and provided the goods are available. If it emerges that the ordered goods cannot be delivered, or cannot be delivered in full, Tibet417 Fashion is entitled not to accept or perform the order, or to accept or perform it only in part. In such a case, Tibet417 Fashion will inform the Customer by email. If the Customer's payment has already been received by Tibet417 Fashion, the payment will be refunded to the Customer. If payment has not yet been made, the Customer is released from the obligation to pay.</p>
        </Clause>

        <Clause number='5' heading='Payment Methods and Retention of Title'>
          <p>The Customer may use the payment methods indicated during the ordering process.</p>
          <p>Tibet417 Fashion reserves the right to exclude Customers from individual payment methods without giving reasons, or to insist on advance payment.</p>
          <p>In the event of the Customer's default in payment, Tibet417 Fashion may charge default interest of 5% per annum as well as a reminder fee of no more than CHF 20 per reminder.</p>
          <p>The products delivered to the Customer remain the property of Tibet417 Fashion until payment has been made in full.</p>
        </Clause>

        <Clause number='6' heading='Delivery, Duty to Inspect, Notice of Defects and Returns'>
          <p>Deliveries are dispatched by post or courier service to the address stated by the Customer in the order.</p>
          <p>Tibet417 Fashion endeavours to observe the shortest possible delivery times. However, any delivery times stated in the order confirmation are non-binding. Tibet417 Fashion is entitled to make partial deliveries. In such a case, the shipping costs will be charged to the Customer only once.</p>
          <p>Where delivery against invoice is offered, the invoice is sent, at the discretion of Tibet417 Fashion, by email or by post.</p>
          <p>If the delivery cannot be delivered or if the Customer refuses to accept the delivery, Tibet417 Fashion may terminate the contract after notifying the Customer by email and allowing a reasonable grace period, and may charge the Customer for the expenses incurred.</p>
          <p>The Customer is obliged to inspect the delivered goods immediately upon receipt of the delivery and to give notice without delay, in writing by letter or email to the address stated in the legal notice (Impressum), of any defects for which Tibet417 Fashion provides a warranty.</p>
          <p>Returns to Tibet417 Fashion are made at the Customer's expense and risk. The Customer must send the goods in their original packaging, complete with all accessories and together with the delivery note and a detailed description of the defects, to the return address specified by Tibet417 Fashion in the legal notice (Impressum).</p>
          <p>If the inspection by Tibet417 Fashion reveals that the goods have no identifiable defects, or that such defects are not covered by the manufacturer's warranty, Tibet417 Fashion may charge the Customer for the expenses incurred, for the return shipment or for any disposal.</p>
        </Clause>

        <Clause number='7' heading='Right of Withdrawal'>
          <p>The Customer is granted a right of withdrawal for 10 calendar days after receipt of the goods. The deadline is deemed met if the Customer sends the written withdrawal by email or letter (address as per the legal notice / Impressum) to Tibet417 Fashion within the deadline. The withdrawal does not require any reasons to be given.</p>
          <p>Exercising the right of withdrawal results in the reversal of the contract. The Customer must return the goods within 10 calendar days, in their original packaging, complete with all accessories and together with the delivery note, to the return address specified by Tibet417 Fashion in the legal notice (Impressum). Returns to Tibet417 Fashion are made at the Customer's expense and risk. Any payment already made will be refunded to the Customer within 20 calendar days, provided that Tibet417 Fashion has already received the goods back or that the Customer can furnish proof of dispatch.</p>
          <p>Tibet417 Fashion reserves the right to claim reasonable compensation for damage, excessive wear or loss of value resulting from improper handling, and to deduct the diminution in value from the purchase price already paid or to invoice it to the Customer.</p>
          <p>No right of withdrawal is granted in the following cases:</p>
          <ul className='list-disc pl-5 flex flex-col gap-2'>
            <li>Where the contract contains an element of chance, in particular because the price is subject to fluctuations over which the supplier has no influence.</li>
            <li>Where the subject matter of the contract is a movable item which, by its nature, is not suitable for return or may spoil quickly.</li>
            <li>Where the subject matter of the contract is a movable item that is manufactured to the Customer's specifications or is clearly tailored to personal needs.</li>
            <li>Where the subject matter of the contract is digital content and such content is not supplied on a physical data carrier, or where the contract is to be performed in full by both contracting parties immediately.</li>
            <li>Where the subject matter of the contract is a service and the contract is to be performed in full by the supplier, with the Customer's prior express consent, before the withdrawal period has expired.</li>
            <li>In the areas of accommodation, transport, the supply of food and beverages, and leisure activities, where the supplier undertakes at the time the contract is concluded to render the services at a specific time or within a precisely specified period.</li>
          </ul>
        </Clause>

        <Clause number='8' heading='Warranty'>
          <p>Tibet417 Fashion endeavours to deliver goods of flawless quality. Where defects have been notified in good time, Tibet417 Fashion warrants that the item purchased by the Customer is free from defects and functional, for the statutory warranty period of, as a rule, two years from the date of delivery. It is at the discretion of Tibet417 Fashion to provide this warranty by way of free repair, equivalent replacement, or refund of the purchase price. Any further warranty rights are excluded.</p>
          <p>The warranty does not cover normal wear and tear, nor the consequences of improper handling or damage by the Customer or third parties, nor defects attributable to external circumstances. Likewise, the warranty is excluded for consumable and wear parts (e.g. batteries, rechargeable batteries, etc.).</p>
          <p>Tibet417 Fashion is unable to give any assurances or guarantees as to the currency, completeness and correctness of the data, or as to the constant or uninterrupted availability of the website, its functionalities, integrated hyperlinks and other content. In particular, no assurance or guarantee is given that use of the website will not infringe the rights of third parties that are not held by Tibet417 Fashion.</p>
        </Clause>

        <Clause number='9' heading='Liability'>
          <p>Tibet417 Fashion excludes any liability, irrespective of its legal basis, as well as any claims for damages against Tibet417 Fashion and against any auxiliary persons and vicarious agents. In particular, Tibet417 Fashion is not liable for indirect damage and consequential damage caused by defects, lost profit, or any other personal injury, property damage or pure financial loss suffered by the Customer. More extensive mandatory statutory liability, for example for gross negligence or unlawful intent, remains reserved.</p>
          <p>Tibet417 Fashion uses hyperlinks solely to simplify the Customer's access to other web offerings. Tibet417 Fashion can neither know the content of these web offerings in detail, nor assume liability or other responsibility for the content of these websites.</p>
        </Clause>

        <Clause number='10' heading='Data Protection'>
          <p>Tibet417 Fashion may process and use the data collected in connection with the conclusion of the contract in order to fulfil the obligations arising from the purchase contract, and may also use it for marketing purposes. The data necessary for performance may also be passed on to commissioned service partners (logistics partners) or other third parties.</p>
          <p>The data protection provisions are available in detail at the following link: Data Protection (Datenschutz)</p>
        </Clause>

        <Clause number='11' heading='Severability'>
          <p>Should individual provisions of these GTC prove to be, or become, invalid or unenforceable, the validity of the remaining provisions shall remain unaffected.</p>
        </Clause>

        <Clause number='12' heading='Further Provisions'>
          <p>Tibet417 Fashion expressly reserves the right to amend these GTC at any time and to bring the amendments into force without notice.</p>
          <p>In the event of disputes, substantive Swiss law shall apply exclusively, to the exclusion of conflict-of-law rules. The United Nations Convention on Contracts for the International Sale of Goods (CISG, Vienna Sales Convention) is expressly excluded.</p>
          <p>The place of jurisdiction is 9000 St. Gallen or the domicile of the consumer.</p>
        </Clause>

        <Clause number='13' heading='Contact'>
          <p>If you have any questions about these GTC, please contact us at: <Link to='/contact' className='underline'>Contact</Link> (Impressum)</p>
        </Clause>

      </div>
    </div>
  )
}

export default Terms
