import React from "react";

export default function ShowSampleModal({
  data,
  showGuestList,
  setShowGuestList,
  CountModelOpenNumber,
  Type,
}) {
  const headers = Object.keys(data?.at(0));

  const CalculateCost = () => {
    let rate;
    if (Type === "Image") {
      rate = 0.25;
    } else if (Type === "Video") {
      rate = 1.0;
    } else {
      rate = 0.5;
    }
    return `Total Credits Required = Total Guest * Cost Per ${Type} : ${data.length.toFixed(
      2
    )} * ${rate} = ${data.length * rate}`;
  };

  const cost = CalculateCost();
  return (
    showGuestList && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-[99]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold justify-between w-full">
              Uploaded CSV
            </h2>
            <span
              className="font-semibold text-2xl"
              onClick={() => setShowGuestList(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
          <div className="container mx-auto mt-8 h-96 overflow-y-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {headers?.map((header) => (
                    <th
                      key={header}
                      className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left capitalize"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((row, index) => (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="py-2 px-4 border-b border-gray-200"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center">
            <span className="text-red-800 inline-block mx-3 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>
              {CountModelOpenNumber <= 0
                ? `This is the Sample Format for Processing Files`
                : `${cost}`}
            </span>
          </div>
          {CountModelOpenNumber <= 0 && (
            <div className="flex items-center justify-center mt-3">
              <a
                href="/sample.csv"
                download="sample.csv"
                type="button"
                className="text-slate-50 rounded-md m-1 bg-[#570000] hover:bg-[#c44141] font-bold text-sm p-2"
                // onClick={() => setShowModal(false)}
              >
                Download Sample
              </a>
            </div>
          )}
        </div>
      </div>
    )
  );
}
