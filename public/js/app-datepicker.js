$(() => {
  let today = new Date();
  let startDate = new Date(today.getFullYear(), 6, 1);
  let endDate = new Date(today.getFullYear(), 6, 31);

  $("#departure_date").datepicker({
    format: "MMMM dd yyyy",
    minViewMode: 1,
    autoClose: true,
    startDate,
    endDate
  });
});