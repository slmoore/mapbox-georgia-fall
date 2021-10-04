
const MonthFilter = (props) => {
    const { activeMonth, handleMonthChange } = props;
    return (
        <form className="month-filter">
            <label htmlFor="october" className="month-filter__label">Late October
                <input type="radio" value="october" id="october" name="month" checked={activeMonth === 'october'} onChange={handleMonthChange} />
            </label>
            <label htmlFor="november" className="month-filter__label">Early November
                <input type="radio" value="november" id="november" name="month" checked={activeMonth === 'november'} onChange={handleMonthChange} />
            </label>
        </form>
    );
};

export default MonthFilter;