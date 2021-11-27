import { Fragment, useState, createRef } from 'react';
import PolicyModal from '../../core/PolicyModal';
import './ParkPolicy.css';

const ParkPolicy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const onClose = () => {
    setIsModalOpen(false);
    return true;
  };
  return (
    <Fragment>
      <div className="m-n5 px-5">
        <div className="d-flex justify-content-center">
          <p style={{
            textAlign: 'center',
            marginBottom: '10rem',
          }}className="d-block text-gray subtitle">By proceeding, you hereby give consent to the <strong onClick={toggleModal} className="pointer policy__hover"><em>park admin agreement</em></strong></p>
        </div>
      </div>
      <PolicyModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        onClose={onClose}
        title={`Park Terms and Conditions`}
      >
        <h4 className="text-gray font-w600 mt-3 mb-3 text-uppercase">park ADMIN AGREEMENT</h4>

        {/*<p className="text-gray my-2">
          ✔  Send me promotional emails
        </p>

        <p className="text-gray my-2">
          ✔  I have read, and hereby acknowledge and accept the park Admin Agreement and Privacy Policy.
        </p>*/}

        <p className="text-gray my-2">
          This Agreement herein after referred to as “Agreement” contains the complete terms and conditions between Mile9ine hereinafter referred to as “Mile9ine” and the bus/car park admin hereinafter referred to as the “Park Admin” with regards to his/her application to participate as a park Admin under this Mile9ine Bus/Car Park Program.
        </p>

        <h5 className="text-gray font-w600 mt-3 mb-3">Interpretations</h5>

        <p className="text-gray my-2">
        ·  “Mile9ine”: shall mean the name, term, design, symbol, brand or any other feature that identifies Mile9ine’s product brand distinct from those of others by means of a distinctive symbol etc.<br />

        ·   “Bus/Car park Program” is a program that accepts applicants who work for designated bus/car transport parks as park admin.<br />
        
        ·   “The Bus/Car park” shall mean a bus/car transport company authorised to appoint a park admin to access and use the Mile9ine website solely for the purpose of booking passenger tickets for the bus/car transport company, as an independent contractor and in accordance with the terms of this agreement. Furthermore, it i s not in liquidation, insolvent, bankrupt or otherwise subject in a position to become subject to bankruptcy proceedings.<br />
        
        ·   “Website” shall mean the Mile9ine website, its pages used for the accepting, and booking of passenger tickets for a bus/car transportation company and other services.<br />
        
        ·   “Passengers” means a person who books a bus/car ticket on the Mile9ine website.<br />
        
        ·   “Licensed materials” are Mile9ine’s website booking products.<br />
        
        ·   “Consent” means an official binding agreement made digitally by parties involved, which is recognized legally.<br />
        
        ·   “Independent contractors” are bus/car transport parks who contracts to make use of the Mile9ine website according to his/her own methods and processes.<br />
        
        ·   “Intellectual property” means Mile9ine’s intangible property that is the result of its creativity, such as patents, copyrights, etc.<br />
        </p>

        <h6 className="text-gray font-w600 mt-3">Whereas</h6>
        <p className="text-gray my-2">
          Mile9ine is an online bus/car transport ticketing website carrying out a business in Nigeria and outside her borders (hopefully).<br />

          The park admin wants permission and approval to access, promote and utilize the Mile9ine website via their bus/car park where s/he have requisite legal tenancy or ownership. S/he is also desirous of utilizing the website for a fee and understands that this agreement is legally binding and carries legal obligations.<br />
          
          The park admin will acquire all the staffing resources and equipment necessary and appropriate to carry on his/her business using the website.
          
          Mile9ine and the park admin are separate independent and autonomous entities. The park admin acknowledges that s/he is an independent contractor.<br />
          
          The applicant recognises that to become a park admin with Mile9ine, s/he must submit a completed application form via the official website, which will be evaluated and the applicant notified of his/her acceptance and that Mile9ine is entitled to reject the application at its sole discretion. The applicant understands s/he shall have no right to appeal any decision to reject his/her application.<br />
          
          The park admin is aware that Mile9ine’s delegated authority is required to act as an agent on its behalf.<br />
          
          The park admin accepts that Mile9ine may suspend this agreement at its sole discretion and without any compensation.<br />
          
          The park admin understands that the product offering under this agreement is online ticket management and any other product introduced by Mile9ine from time to time.<br />
        </p>

        <ul>
          <li className="mb-3">
            <h4 className="text-gray font-w600">1.  NON-COMPETITION AGREEMENT</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                ·   That the park admin cannot carry out activities provided by the object of this agreement on behalf of companies/entities in competition with Mile9ine.<br />

                ·   That the park admin does not own any holding, directly or indirectly, in any entity in competition with Mile9ine. In the event that this is discovered, Mile9ine reserves the right to pursue damages.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">2.  OBLIGATIONS OF THE park ADMIN</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
              ·   To engage in a continuous manner, the continuous utilization of the website.<br />

              ·   To refrain from engaging in conducts intended to affect the operation and communications with Mile9ine.<br />
              
              ·   Ensuring that at least one responsible and professional staff is maintained at all times during business hours to provide courteous service to customers.<br />
              
              ·   The park Admin is solely responsible for the technical operation of his/her facilities and his/her designated bus/car park and staff.<br />
              
              ·   The park Admin has complied with all obligations to their employees, arising from laws and regulations concerning Nigeria Labour Laws.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">3.  OBLIGATIONS OF MILE9INE</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
              ·   To provide an admin account for the park admin to carry out online ticketing operations.<br />

              ·   Mile9ine agrees to do its best to provide all reasonable cooperation in order to enable compliance with relevant authorities.<br />

              ·   To deal promptly with technical issues under the control of Mile9ine.<br />

              ·   To provide administrative assistance and support for the proper management and commercial operations of Mile9ine.<br />

              ·   Mile9ine shall not be held liable for interruptions in the supply of service in anyway including but not limited to, those dependent on suppliers of telecommunication network/services as well as suppliers of technological/IT services and/or employees by force majeure.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">4.  INTELLECTUAL PROPERTY</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
              ·   By entering this agreement, the park admin is accepting that Mile9ine shall grant him/her a non-transferable, non-exclusive, revocable license to use the website to facilitate his/her bus/car transportation business.<br />

              ·   The park admin is not permitted to alter, modify or change the licensed materials in anyway whatsoever.<br />

              ·   The park admin is not permitted to use the licensed materials in any manner that is disparaging or otherwise portrays Mile9ine or anyone else negatively.<br />

              ·   The park admin acknowledges that s/he has not acquired and will not acquire any right, interest or title to the Mile9ine brand by reason of his/her activities hereunder.<br />

              ·   Mile9ine reserves all its intellectual property rights in the licensed materials.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">5.  TERM</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
              ·   The terms of this agreement will begin upon acceptance as a park admin and will end when terminated by either party.<br />

              ·   At any time, Mile9ine or the park admin may terminate this agreement with or without cause, by giving the other party 30 days written notice of termination, and such notice may be served via email or written letter.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">6.  MODIFICATION</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                ·   Mile9ine can modify any of the terms and conditions contained in this agreement at any time at its sole discretion.<br />

                ·   The park admin agrees that posting of modification/update of this agreement on the Mile9ine website and/or by mail is considered sufficient provision of notice and as such, modifications shall be effective as of date of posting so long as the website services are still in use. Modifications may include, but are not limited to, changes in terms and payment schedule.<br />
                
                ·   If any modification is unacceptable to the park admin, his/her sole recourse is to terminate this agreement and his or her continued participation following posting of modification of agreement on the Mile9ine website.<br />
                
                ·   The park admin has agreed to frequently visit the mile9ine website to review the terms and conditions of this agreement.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">7.  LIMITATION OF LIABILITY</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                ·   Mile9ine will not be liable for any indirect, special or consequential damages, or any loss of revenue, profits or data rising in connection with this agreement in the course of facilities used in the bus/car park of the park agent.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">8.  RELATIONSHIP OF PARTIES</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                ·   The park admin and Mile9ine are independent contractors, and nothing in this agreement will create any partnership, joint venture, agency, franchise, sales representative, or employment relationship between the parties.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">9.  DISCLAIMERS</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                ·   Mile9ine makes no express or implied warranties or representations with respect to and/or including without limitation warranties of fitness, merchantability, non-infringement, or any implied warranties arising out of a course of performance, dealing, or trade usage.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">10.  REPRESENTATIONS AND WARRANTIES</h4>
            <h6 className="my-2">The park admin hereby represent and warrant to Mile9ine the following;</h6>
            <div className="ml-4">
              <p className="text-gray my-2">
                i.    S/he has accepted the terms and conditions of this agreement, which creates legal, valid and binding obligations, enforceable in accordance with its terms.<br />

                ii.   Such acceptance, performance and consummation of transactions contemplated hereby will not conflict with or violate any provision of law, rule, regulation or agreement to which s/he is subject to.<br />

                iii.  S/he is an adult of at least 18 years of age and further represents that s/he has evaluated the laws relating to his activities and obligations hereunder and s/he has independently concluded that he can enter into this agreement and fulfill his obligations hereunder without violating any applicable rule of law.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">11.  CONFIDENTIALITY</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                ·   Mile9ine may disclose to the agent certain confidential information as a result of his/her participation as a park admin (herein referred to as “Confidential Information”). Confidential information shall remain strictly confidential and secret and shall not be utilized, directly or indirectly, by the park admin for his/her own business purposes or for any other purpose except and solely to the extent that any such information is generally known or available to the public or if the same is required by law or legal process.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">12.  INDEMNIFICATION</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                .   The park admin hereby agrees to indemnify, defend and hold harmless Mile9ine, its shareholders, officers, directors, employees, agents, successors and assigns, from and against any and all claims, losses, liabilities, damages or expenses (including legal fees and costs) of any nature whatsoever incurred or suffered  by Mile9ine (collectively the “Losses”), in so far as such losses (or actions in respect thereof) arise out of or are based on the breach of this agreement by the park admin.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">13.  ENTIRE AGREEMENT</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                ·   The provisions contained in this agreement constitute the entire agreement between the parties with respect to the subject matter of this agreement, and no statement or inducement with respect to such subject matter by any party which is not contained in this agreement shall be valid or binding between the parties.<br />

                ·   The park admin acknowledges that he has read this agreement, evaluated interest in being a party to execute this agreement, has had an opportunity to consult with his own legal advisor and agree to all its terms and conditions.<br />
                
                ·   This Agreement and any matters relating hereto shall be governed by and construed in accordance with Nigerian laws.<br />
                
                ·   The park admin cannot assign this agreement, by operation of law or otherwise, without prior written consent of Mile9ine. Subject to that restriction, this agreement will be binding on and enforceable against the parties and their respective successors and assigns.<br />
                
                ·   The failure of Mile9ine to enforce strict performance of any provision of this agreement will not constitute a waiver of its right to subsequently enforce such provision or any other provision of this agreement.<br />
              </p>
            </div>
          </li>

          <li className="mb-3">
            <h4 className="text-gray font-w600">14.   DISPUTE RESOLUTION</h4>
            <div className="ml-4">
              <p className="text-gray my-2">
                .   The parties hereto agree that in the event that there is any dispute between them arising out of this agreement or in the interpretation of any of the provisions hereof, they shall endeavour to meet in an effort to resolve such dispute by discussion between them. In an event that such resolution fails, an appointed representative of Mile9ine and the park admin shall meet to resolve such dispute and their decisions shall be binding upon the parties hereto. But in an event that a settlement of any such dispute or difference is not reached pursuant to this sub-clause, then legal channels may be pursued.<br />
              </p>
            </div>
          </li>

        </ul>
      </PolicyModal>
    </Fragment>
  );
}

export default ParkPolicy;
