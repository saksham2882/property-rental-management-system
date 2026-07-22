import { RentalApplication } from '../models/application-model';
import { Property } from '../models/property-model';


export function generateLeaseAgreement(
  app: RentalApplication,
  formValues: { startDate: string; endDate: string; monthlyRent: number; deposit: number; conditions: string },
  property: Property | undefined,
  adminName?: string
): string {

  const startStr = new Date(formValues.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const endStr = new Date(formValues.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const rentFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(formValues.monthlyRent || 0);
  const depositFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(formValues.deposit || 0);
  const stampDutyNo = `RE-${Math.floor(100000 + Math.random() * 900000)}`;

  return `
    <div class="legal-contract-document" style="font-family: 'Outfit', 'Inter', sans-serif; color: var(--text); line-height: 1.8; font-size: 0.9rem;">
      <!-- Header / Stamp Duty Banner -->
      <div style="border: 2px solid var(--primary); padding: 15px; border-radius: 12px; margin-bottom: 30px; background: rgba(139, 92, 246, 0.02); display: flex; justify-content: space-between; align-items: center; border-left: 6px solid var(--primary);">
        <div>
          <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em;">Digital E-Stamp Certificate</div>
          <div style="font-size: 0.95rem; font-weight: 850; color: var(--text);">Certificate No: ${stampDutyNo}</div>
          <div style="font-size: 0.72rem; color: var(--text-2); margin-top: 2px;">Verified under IT Act, Section 65B - Digital Tenancy Contracts</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.65rem; font-weight: 750; color: var(--muted); text-transform: uppercase;">Stamp Duty Paid</div>
          <div style="font-size: 1.1rem; font-weight: 850; color: #10b981;">₹500.00</div>
        </div>
      </div>

      <h3 style="text-align: center; color: var(--primary); font-weight: 850; margin-bottom: 28px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid var(--border); padding-bottom: 12px;">Residential Lease Agreement</h3>
      
      <p style="text-align: justify; margin-bottom: 16px;">This Residential Lease Agreement ("Agreement") is made and entered into on this <strong>${startStr}</strong>, by and between the Landlord, <strong>${adminName || 'RentEase Administration'}</strong>, acting as the authorized property management partner on behalf of the registered property owner, and the Tenant, <strong>${app.applicantName}</strong> (having contact coordinates: Email: <strong>${app.applicantEmail}</strong>, Phone: <strong>${app.applicantPhone || 'N/A'}</strong>).</p>

      <p style="margin-bottom: 24px;">WHEREAS, Landlord is the administrator of the residential property described below and desires to lease the Premises to Tenant, and Tenant desires to lease the Premises from Landlord under the terms and covenants set forth herein:</p>

      <!-- Section 1 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">1. Demised Premises</h4>
      <p style="text-align: justify; margin-bottom: 12px;">The Landlord hereby leases to the Tenant, and the Tenant hereby accepts and takes from the Landlord, the residential premises located at:</p>
      <div style="background: var(--bg-2); padding: 16px; border-radius: 12px; font-weight: 700; border-left: 4px solid var(--accent); color: var(--text-2); margin-bottom: 16px; border: 1.5px solid var(--border);">
        <span style="font-size: 0.95rem; color: var(--text);">${property?.title || 'Rental Space'}</span><br/>
        <span style="font-size: 0.8rem; font-weight: 500; color: var(--muted); display: block; margin-top: 4px;">Locality: ${property?.locality || 'N/A'}, City: ${property?.city || 'N/A'}</span>
      </div>

      <!-- Section 2 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">2. Term of Lease & Extension</h4>
      <p style="text-align: justify; margin-bottom: 16px;">The term of this lease shall be for the period commencing on <strong>${startStr}</strong> (the "Commencement Date") and ending on <strong>${endStr}</strong> (the "Expiration Date"). The Tenant agrees to vacate the premises on the Expiration Date unless a written extension is executed. Any extension request must be formally submitted in writing to the Landlord via the RentEase Portal at least thirty (30) days prior to the Expiration Date. Holding over without prior written authorization will incur double daily rent charges.</p>

      <!-- Section 3 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">3. Rent, Utilities & Late Penalties</h4>
      <p style="text-align: justify; margin-bottom: 12px;">The Tenant agrees to pay the Landlord a monthly rent amount of <strong>${rentFormatted} / month</strong>. Rent shall be payable in advance on or before the fifth (5th) day of each calendar month. Payments must be processed through the RentEase Payment gateway using authorized online channels.</p>
      <p style="text-align: justify; margin-bottom: 12px;"><strong>Late Payments:</strong> Any rent invoice remaining unpaid after the 5th day of the month shall incur a late payment penalty fee equivalent to five percent (5%) per week of the outstanding amount, calculated from the 6th day until payment is processed in full.</p>
      <p style="text-align: justify; margin-bottom: 16px;"><strong>Utilities:</strong> Monthly rent is exclusive of electricity, water, internet, and special society maintenance charges. The Tenant is liable to pay all utility bills directly to the respective providers on time.</p>

      <!-- Section 4 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">4. Security Deposit Covenants</h4>
      <p style="text-align: justify; margin-bottom: 16px;">The Tenant shall deposit a sum of <strong>${depositFormatted}</strong> with the Landlord upon execution of this Agreement as a refundable Security Deposit. The Landlord shall hold this security deposit in escrow as assurance for Tenant's performance of covenants. Upon structural vacate, the deposit shall be returned to the Tenant within fifteen (15) working days, subject to deductions for unpaid utilities, cleaning charges, or cost of repairs for damages exceeding ordinary wear and tear.</p>

      <!-- Section 5 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">5. Use of Premises & Occupancy Guidelines</h4>
      <p style="text-align: justify; margin-bottom: 16px;">The Premises shall be occupied and used solely as a private, single-family residential dwelling. The Tenant shall not permit the premises to be occupied by any persons other than the declared occupants under the rental application (maximum <strong>${app.occupants || 1} occupants</strong>) without prior written permission from the Administration. Subletting, assigning, or licensing the premises to any third parties is strictly prohibited and constitutes automatic grounds for immediate lease termination and eviction.</p>

      <!-- Section 6 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">6. Maintenance, Repairs & Minor Work Limit</h4>
      <p style="text-align: justify; margin-bottom: 12px;">The Tenant shall keep the premises in a clean, hygienic, and safe condition. The Tenant agrees to bear the costs of all minor repairs, including but not limited to light bulb replacements, minor plumbing blockages, and tap washer repairs, up to a maximum limit of <strong>₹2,000 per occurrence</strong>. Any major repair requirements or structural issues must be reported immediately to the Landlord via the portal maintenance request form.</p>
      <p style="text-align: justify; margin-bottom: 16px;">The Tenant shall make no structural alterations, additions, painting, or heavy drilling in the premises without prior written consent from the Landlord.</p>

      <!-- Section 7 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">7. Right of Entry & Inspection</h4>
      <p style="text-align: justify; margin-bottom: 16px;">The Landlord and its authorized maintenance personnel reserve the right to enter the Premises during reasonable business hours for the purposes of inspect, structural repairs, or showing the property to prospective tenants. The Landlord agrees to provide the Tenant with at least twenty-four (24) hours advance notice of such planned entry, except in cases of emergency where immediate entry is required.</p>

      <!-- Section 8 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">8. Indemnification & Liability Limitation</h4>
      <p style="text-align: justify; margin-bottom: 16px;">The Tenant agrees to indemnify and hold harmless the Landlord from any liabilities, claims, or damages arising out of Tenant's negligence or violation of terms. The Landlord is not responsible for any theft, damage, or loss of Tenant's personal belongings stored on the premises, and the Tenant is highly encouraged to obtain tenant's insurance coverage independently.</p>

      <!-- Section 9 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">9. Covenants & Special Conditions (Admin Set)</h4>
      <p style="text-align: justify; margin-bottom: 12px;">The following specific rules, conditions, and special covenants have been designated by the Administration and must be complied with in full:</p>
      <div style="white-space: pre-line; background: var(--bg-2); padding: 18px; border-radius: 12px; font-size: 0.84rem; line-height: 1.6; color: var(--text-2); border: 1.5px dashed var(--border); margin-bottom: 20px;">
        ${formValues.conditions || 'None'}
      </div>

      <!-- Section 10 -->
      <h4 style="color: var(--primary); font-weight: 800; font-size: 0.95rem; margin-top: 24px; margin-bottom: 8px; text-transform: uppercase; border-left: 3px solid var(--primary); padding-left: 8px;">10. Governing Law, Resolution & Dispute</h4>
      <p style="text-align: justify; margin-bottom: 24px;">This Agreement shall be governed by, interpreted, and enforced in accordance with the laws of the jurisdiction in which the Premises is located. Any disputes, arguments, or claims arising out of this lease shall be resolved amicably through the arbitration panel managed by RentEase, and if unresolved, will be subject to local court jurisdiction.</p>

      <!-- Execution footer statement -->
      <p style="font-size: 0.8rem; color: var(--muted); text-align: center; border-top: 1px solid var(--border); padding-top: 16px; margin-top: 28px;">IN WITNESS WHEREOF, the Parties have executed this Residential Lease Agreement digitally, and confirm that their digital signatures hold legal validity under Section 4 of the Information Technology Act.</p>
    </div>
  `;
}
