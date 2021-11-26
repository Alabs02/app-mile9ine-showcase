import React, { useState } from 'react';
import {BiArrowBack} from 'react-icons/bi';
import { useHistory } from 'react-router-dom';
import { postRequest } from '../utils/axiosClient';
import { catchAxiosErrors, getToken } from '../utils';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loading-icons';
import './VerifyEmail.css';
import 'animate.css';


const VerifyEmail = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  console.log('getToken: ', getToken().then(r => r));

  const resendEmailLink = async () => {
    try {
      setIsLoading(true);

      const { data, status, statusText } = await postRequest(`/park_admin/email/resend`, null, {
        headers: {
          authorization: `Bearer ${await getToken()}`
        }
      });

      if (data) {
        console.log(data, status, statusText);
        toast.success(`Verification link sent successfully, check your mail cheers 🥂`);
        setIsLoading(false);
      }
    } catch (err) {
      catchAxiosErrors(err, setIsLoading, null);
    }
  }

  return (
    <> 
      <div className="container-fluid fluid">
        <div className="card shadow-hover shadow-sm card-container p-4 mt-5 mb-5">
          <BiArrowBack onClick={() => history.goBack()} size={'25px'} className="back-btn" />
          <h3 className="text-center fs-3s mt-3">Verify your email</h3>
          <p className="text-center fs-5">You will need to verify your email to complete registration</p>
          <div className="text-center my-3">
            <svg id="a063a011-c7fd-495c-af8f-4b3f764f6bd6" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width={200} height={200} viewBox="0 0 576.49928 493.5"><path d="M481.17233,691.60038c9.25458-7.82,14.87595-20.17341,13.40175-32.19951s-10.605-23.08177-22.44888-25.63556-25.34517,4.51552-28.94256,16.08527c-1.97981-22.306-4.26119-45.54663-16.12049-64.54228-10.73831-17.2001-29.33726-29.50744-49.49431-31.70921s-41.37985,6.11408-53.95107,22.0238-15.64923,39.03914-6.84467,57.3048c6.486,13.45569,18.43551,23.46957,30.95562,31.61638a199.78578,199.78578,0,0,0,136.64075,29.89252" transform="translate(-311.75036 -203.25)" fill="#f2f2f2" /><path d="M343.54974,560.17414A326.87926,326.87926,0,0,1,389.10355,605.409a327.83254,327.83254,0,0,1,51.30832,85.74145c.92389,2.264-2.75246,3.24952-3.66608,1.0107a324.46215,324.46215,0,0,0-29.64717-56.09367,325.69973,325.69973,0,0,0-66.23723-73.20495c-1.898-1.54556.806-4.22115,2.68835-2.68834Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M487.56461,691.60038c-9.25458-7.82-14.87595-20.17341-13.40175-32.19951s10.605-23.08177,22.44888-25.63556,25.34518,4.51552,28.94256,16.08527c1.97982-22.306,4.26119-45.54663,16.1205-64.54228,10.7383-17.2001,29.33725-29.50744,49.49431-31.70921s41.37984,6.11408,53.95106,22.0238,15.64923,39.03914,6.84468,57.3048c-6.486,13.45569-18.43552,23.46957-30.95563,31.61638a199.78578,199.78578,0,0,1-136.64075,29.89252" transform="translate(-311.75036 -203.25)" fill="#f2f2f2" /><path d="M625.18721,560.17414A326.87878,326.87878,0,0,0,579.63339,605.409a327.83254,327.83254,0,0,0-51.30832,85.74145c-.92389,2.264,2.75246,3.24952,3.66608,1.0107a325.98749,325.98749,0,0,1,95.8844-129.29862c1.898-1.54556-.806-4.22115-2.68834-2.68834Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><circle cx="203.27678" cy={191} r={31} fill="#f2f2f2" /><path d="M419.4457,287.3877H633.02714V299.073H446.71128a83.41834,83.41834,0,0,0-83.41857,83.41839V515.25H339.92222a3.89516,3.89516,0,0,1-3.89508-3.89508V370.80609A83.41833,83.41833,0,0,1,419.4457,287.3877Z" transform="translate(-311.75036 -203.25)" fill="#f2f2f2" /><path d="M460.52714,692.25V514.75h52v177.5a4.50508,4.50508,0,0,1-4.5,4.5h-43A4.50508,4.50508,0,0,1,460.52714,692.25Z" transform="translate(-311.75036 -203.25)" fill="#3f3d56" /><path d="M325.02714,511.25V366.91553A86.76355,86.76355,0,0,1,411.69242,280.25H632.02714v236h-302A5.00573,5.00573,0,0,1,325.02714,511.25Zm305-229H411.69242a84.76141,84.76141,0,0,0-84.66528,84.66553V511.25a3.00328,3.00328,0,0,0,3,3h300Z" transform="translate(-311.75036 -203.25)" fill="#3f3d56" /><path d="M515.02714,410.25a18.02031,18.02031,0,0,1-18-18v-129a3.00328,3.00328,0,0,0-3-3h-70a5.0058,5.0058,0,0,1-5-5v-47a5.0058,5.0058,0,0,1,5-5h104a5.00573,5.00573,0,0,1,5,5v184A18.02031,18.02031,0,0,1,515.02714,410.25Z" transform="translate(-311.75036 -203.25)" fill="#fe634e" /><path d="M640.02714,278.25h0a56.88093,56.88093,0,0,1,57,56.76144V499.32108h112a16.96465,16.96465,0,0,1,17,16.92887h-243V335.01143A56.88093,56.88093,0,0,1,640.02714,278.25Z" transform="translate(-311.75036 -203.25)" fill="#3f3d56" /><path d="M626.34909,371.81749l11.80284,48.75606L869.03313,364.682l-11.80284-48.75606a3.6384,3.6384,0,0,0-2.35767-2.59508,3.59409,3.59409,0,0,0-1.33406-.20075L720.07937,244.02819a3.682,3.682,0,0,0-4.65628,1.11925l-64.31987,89.69375L626.85528,368.664a.51379.51379,0,0,0-.089.41825A3.64176,3.64176,0,0,0,626.34909,371.81749Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M626.7663,369.08226a.48973.48973,0,0,0,.20314.31583.55943.55943,0,0,0,.43331.08552.53586.53586,0,0,0,.29889-.20727l.08326-.11537,1.26254-1.76554,22.92889-31.96427,64.30082-89.6732a2.6198,2.6198,0,0,1,3.32194-.79624l132.42537,68.56666,1.18838.6168a1.29216,1.29216,0,0,0,.14733.05165,1.61549,1.61549,0,0,1,.27147-.026.51364.51364,0,0,0,.28983-.24474.524.524,0,0,0-.21883-.7087l-.16408-.08726L720.07937,244.02819a3.682,3.682,0,0,0-4.65628,1.11925l-64.31987,89.69375L626.85528,368.664A.51379.51379,0,0,0,626.7663,369.08226Z" transform="translate(-311.75036 -203.25)" fill="#3f3d56" /><path d="M696.10724,374.05386l5.13934.57012,38.14252,4.22535,25.28583,2.79936,1.49358.166,31.55217-24.64477,1.20883-.944,7.45235-5.82019,26.5135-20.70629.15919-1.45441,9.43044-85.11413a4.4539,4.4539,0,0,0-3.92912-4.91152L712.7,224.27763a4.456,4.456,0,0,0-4.91157,3.9292L701.138,288.24439l-3.689,33.28581L694.149,351.30867l-1.52976,13.82919-.44637,4.00573A4.45691,4.45691,0,0,0,696.10724,374.05386Z" transform="translate(-311.75036 -203.25)" fill="#e6e6e6" /><path d="M730.69234,299.44776l54.51668,6.03806,19.33354,2.14069a6.53968,6.53968,0,1,0,1.43979-12.99988l-24.04683-2.66322-49.79941-5.52188a6.54306,6.54306,0,0,0-1.44377,13.00623Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M727.58833,323.56377c.14068.02515.28136.05031.42455.06411l63.28515,7.0109,10.5663,1.17291a6.54214,6.54214,0,0,0,1.43855-13.005l-15.27834-1.69033-50.13045-5.5548-8.43621-.93485a6.53913,6.53913,0,0,0-1.86955,12.937Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M720.42587,344.94759a6.53866,6.53866,0,0,0,4.88047,3.12537l25.9387,2.87281,46.19708,5.118.01018-.00247,1.47721.16462,7.45235-5.82019a6.47057,6.47057,0,0,0,.0011-1.33,6.5548,6.5548,0,0,0-5.78686-5.82386l-6.41729-.713-25.457-2.81712-18.31689-2.0315-23.66022-2.62223a6.54,6.54,0,0,0-6.31878,9.87953Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M756.8588,269.96954l13.5644,1.50232,5.99124.66537,9.05013,1.00159a6.54214,6.54214,0,0,0,1.43855-13.005l-28.59932-3.16545a6.54059,6.54059,0,1,0-1.445,13.00113Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M645.9437,306.1818l16.53736,68.3138,27.60123,5.24823,25.532,4.86089,27.39356,5.21238,8.753,1.6657a3.6733,3.6733,0,0,0,2.93957-.71161l7.02206-5.48451,4.44605-3.472,31.55217-24.64477-20.062-82.87362a4.40272,4.40272,0,0,0-1.24424-2.15908,4.44864,4.44864,0,0,0-4.12489-1.11718L649.22,300.81267A4.45037,4.45037,0,0,0,645.9437,306.1818Z" transform="translate(-311.75036 -203.25)" fill="#fe634e" /><path d="M683.86407,360.52788a6.54613,6.54613,0,0,0,7.89577,4.818l72.2144-17.48162a6.54974,6.54974,0,0,0,4.818-7.89578,2.09959,2.09959,0,0,0-.0705-.24672,6.53879,6.53879,0,0,0-7.82527-4.5713l-72.2144,17.48161A6.54613,6.54613,0,0,0,683.86407,360.52788Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M690.08229,379.74383l25.532,4.86089L769.69885,371.512a6.54051,6.54051,0,1,0-3.07775-12.7138l-72.21439,17.48162a6.49388,6.49388,0,0,0-3.74749,2.51147A6.5835,6.5835,0,0,0,690.08229,379.74383Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M743.00785,389.8171l8.753,1.6657a3.6733,3.6733,0,0,0,2.93957-.71161l7.02206-5.48451Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M698.41482,323.89664a6.54611,6.54611,0,0,0,7.89577,4.818l27.97037-6.77105a6.54973,6.54973,0,0,0,4.818-7.89577,6.46594,6.46594,0,0,0-1.20489-2.48625,6.5454,6.5454,0,0,0-6.69088-2.33178l-27.97037,6.77105a6.54142,6.54142,0,0,0-4.818,7.89577Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M715.61222,384.60434l27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm81.83767-28.539.26672,1.10181,1.21521-.9448Zm-81.83767,28.539,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm0,0,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm-89.26313-12.78685,30.916,127.71019a3.66655,3.66655,0,0,0,4.42206,2.69835l223.76079-54.16788a3.6663,3.6663,0,0,0,2.69835-4.42206l-30.916-127.71018a3.6384,3.6384,0,0,0-2.35767-2.59508,3.59409,3.59409,0,0,0-1.33406-.20075,3.45812,3.45812,0,0,0-1.5141.3983,3.17906,3.17906,0,0,0-.60724.37708l-18.36413,14.33976-26.67024,20.83345-8.93478,6.97911.00182.00751-.00769.00186-32.7657,25.578-5.41664,4.23905-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357L690.656,378.79172,630.59485,367.362a3.59025,3.59025,0,0,0-1.54741.03342,3.66988,3.66988,0,0,0-1.78823,1.03592,4.11057,4.11057,0,0,0-.49291.65091A3.64176,3.64176,0,0,0,626.34909,371.81749Zm89.26313,12.78685,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm0,0,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm0,0,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Z" transform="translate(-311.75036 -203.25)" fill="#fff" /><path d="M715.61222,384.60434l27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm81.83767-28.539.26672,1.10181,1.21521-.9448Zm-81.83767,28.539,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm0,0,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357ZM627.7849,369.161l.13589.102c.02275-.03727.06233-.07063.09239-.10968a2.64256,2.64256,0,0,1,2.38507-.76779l59.68567,11.354,25.5283,4.86479,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357L690.656,378.79172,630.59485,367.362a3.59025,3.59025,0,0,0-1.54741.03342Zm-1.43581,2.65652,30.916,127.71019a3.66655,3.66655,0,0,0,4.42206,2.69835l223.76079-54.16788a3.6663,3.6663,0,0,0,2.69835-4.42206l-30.916-127.71018a3.6384,3.6384,0,0,0-2.35767-2.59508,3.59409,3.59409,0,0,0-1.33406-.20075,3.45812,3.45812,0,0,0-1.5141.3983,3.17906,3.17906,0,0,0-.60724.37708l-18.36413,14.33976-26.67024,20.83345-8.93478,6.97911.00182.00751-.00769.00186-32.7657,25.578-5.41664,4.23905-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357L690.656,378.79172,630.59485,367.362a3.59025,3.59025,0,0,0-1.54741.03342,3.66988,3.66988,0,0,0-1.78823,1.03592,4.11057,4.11057,0,0,0-.49291.65091A3.64176,3.64176,0,0,0,626.34909,371.81749Zm1.0196-.24682a2.59762,2.59762,0,0,1,.46152-2.19054.34094.34094,0,0,1,.09058-.11714c.02275-.03727.06233-.07063.09239-.10968a2.64256,2.64256,0,0,1,2.38507-.76779l59.68567,11.354,25.5283,4.86479,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585,4.44395-3.47195,31.54686-24.64821,1.21521-.9448,7.44662-5.81748,26.5182-20.70938,19.17121-14.97157a2.60368,2.60368,0,0,1,.98714-.477,1.99722,1.99722,0,0,1,.30518-.05006,1.61549,1.61549,0,0,1,.27147-.026,2.67893,2.67893,0,0,1,.90068.14691,2.625,2.625,0,0,1,1.68605,1.85318l30.916,127.71019a2.61952,2.61952,0,0,1-1.93138,3.16522L661.4422,501.21416a2.61809,2.61809,0,0,1-3.1575-1.93331Zm88.24353,13.03367,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm0,0,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Zm0,0,27.398,5.21358,8.75042,1.66643a3.68877,3.68877,0,0,0,2.938-.71124l7.02714-5.48585-2.46594.59695-5.20559,4.061a2.63556,2.63556,0,0,1-2.09887.5081l-6.47926-1.23238-27.398-5.21357Z" transform="translate(-311.75036 -203.25)" fill="#3f3d56" /><path d="M827.1291,422.96742a8.12818,8.12818,0,0,1,5.98077-9.80128l28.24156-6.8367a8.119,8.119,0,0,1,3.82051,15.78205l-28.24156,6.8367A8.12818,8.12818,0,0,1,827.1291,422.96742Z" transform="translate(-311.75036 -203.25)" fill="#fe634e" /><circle cx="203.27678" cy={189} r={7} fill="#fff" /></svg>
          </div>

          <div className="text-center email-copy">
            <p>An email has been sent to alabson.inc@gmail.com with a link to  verify your account. If you have not received the email after a few minutes, please check your spam folder.</p>
          </div>


          <div className="card-actions mt-3 mb-3 text-center">
            <div className="row-action d-md-flex justify-content-md-between align-items-md-center flex-sm-column flex-md-row">

              { isLoading 
                ? <ThreeDots className="animate__animated animate__pulse" height="1em" width="3.5em" stroke="#fe634e" />
                : <button onClick={resendEmailLink} className="btn btn-primary btn-action">Resend Email</button>
              }
              <button className="btn btn-outline-primary animate__animated animate__pulse">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyEmail;
