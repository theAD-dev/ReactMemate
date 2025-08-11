import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Calendar3 } from 'react-bootstrap-icons';
import clsx from 'clsx';
import style from './approval.module.scss';

const WeekNavigator = ({ onWeekChange }) => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [currentYear, setCurrentYear] = useState(() => {
    const nowSydney = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    return nowSydney.getFullYear();
  });
  const [weekInfo, setWeekInfo] = useState({ start: '', end: '' });

  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYearNum - i);

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getWeekDates = (weekNumber, year) => {
    const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
    const dayOfWeek = firstDayOfYear.getUTCDay(); // Sunday = 0
    const daysOffset = (weekNumber - 1) * 7 - ((dayOfWeek + 6) % 7);
    const mondayUTC = new Date(Date.UTC(year, 0, 1 + daysOffset));

    // Convert to Sydney time
    const options = { timeZone: 'Australia/Sydney' };
    const mondaySydney = new Date(mondayUTC.toLocaleString('en-US', options));

    // Week start: Monday 12:01 PM Sydney time
    mondaySydney.setHours(12, 1, 0, 0);

    // Week end: Next Monday 12:00 AM Sydney time
    const nextMondaySydney = new Date(mondaySydney);
    nextMondaySydney.setDate(nextMondaySydney.getDate() + 7);
    nextMondaySydney.setHours(0, 0, 0, 0);

    return { start: mondaySydney, end: nextMondaySydney };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  useEffect(() => {
    const todaySydney = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
    );
    const weekNum = getWeekNumber(todaySydney);
    setCurrentWeek(weekNum);

    updateWeekDates(weekNum, currentYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateWeekDates(currentWeek, currentYear);

    if (onWeekChange) {
      const { start, end } = getWeekDates(currentWeek, currentYear);
      onWeekChange({
        week: currentWeek,
        year: currentYear,
        startDate: start,
        endDate: end
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek, currentYear]);

  const updateWeekDates = (week, year) => {
    const { start, end } = getWeekDates(week, year);
    setWeekInfo({
      start: formatDate(start),
      end: formatDate(end)
    });
  };

  const goToPreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    } else {
      setCurrentYear(currentYear - 1);
      setCurrentWeek(52);
    }
  };

  // Check if next week button should be disabled
  const isNextButtonDisabled = () => {
    const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    const currentYearNum = currentDate.getFullYear();

    // Disable if we're in a future year
    if (currentYear > currentYearNum) {
      return true;
    }

    // Disable if we're in the current year and at or beyond the current week
    if (currentYear === currentYearNum) {
      const currentWeekNum = getWeekNumber(currentDate);
      if (currentWeek >= currentWeekNum) {
        return true;
      }
    }

    return false;
  };

  const goToNextWeek = () => {
    // Don't proceed if button is disabled
    if (isNextButtonDisabled()) {
      return;
    }

    // Normal week navigation logic
    if (currentWeek < 52) {
      setCurrentWeek(currentWeek + 1);
    } else {
      setCurrentYear(currentYear + 1);
      setCurrentWeek(1);
    }
  };

  const handleYearSelect = (year) => {
    const selectedYear = parseInt(year);
    const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    const currentYearNum = currentDate.getFullYear();

    // Prevent selecting future years
    if (selectedYear > currentYearNum) {
      return;
    }

    // If selecting current year, make sure week is not in the future
    if (selectedYear === currentYearNum) {
      const currentWeekNum = getWeekNumber(currentDate);
      if (currentWeek > currentWeekNum) {
        setCurrentWeek(currentWeekNum);
      }
    }

    setCurrentYear(selectedYear);
  };

  return (
    <div className='d-flex align-items-center w-100' style={{ gap: '32px', position: 'relative' }}>
      <Dropdown style={{ position: 'absolute', right: '16px' }}>
        <Dropdown.Toggle as={Button} className={clsx(style.button, "outline-button mx-auto")}>
          <Calendar3 size={16} color="#667085" />
          {currentYear}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {years.map(year => (
            <Dropdown.Item
              key={year}
              onClick={() => handleYearSelect(year)}
              active={year === currentYear}
            >
              {year}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <div className='d-flex align-items-center mx-auto'>
        <button
          className='border-0'
          style={{
            background: 'transparent',
            cursor: 'pointer',
            opacity: 1
          }}
          onClick={goToPreviousWeek}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.35355 1.80514C8.54882 2.0004 8.54882 2.31698 8.35355 2.51224L2.70711 8.15869L8.35355 13.8051C8.54882 14.0004 8.54882 14.317 8.35355 14.5122C8.15829 14.7075 7.84171 14.7075 7.64645 14.5122L1.64645 8.51224C1.45118 8.31698 1.45118 8.0004 1.64645 7.80514L7.64645 1.80514C7.84171 1.60988 8.15829 1.60988 8.35355 1.80514Z" fill="#344054" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12.3536 1.80514C12.5488 2.0004 12.5488 2.31698 12.3536 2.51224L6.70711 8.15869L12.3536 13.8051C12.5488 14.0004 12.5488 14.317 12.3536 14.5122C12.1583 14.7075 11.8417 14.7075 11.6464 14.5122L5.64645 8.51224C5.45118 8.31698 5.45118 8.0004 5.64645 7.80514L11.6464 1.80514C11.8417 1.60988 12.1583 1.60988 12.3536 1.80514Z" fill="#344054" />
          </svg>
        </button>

        <div className='d-flex align-items-center justify-content-center' style={{ gap: '4px', width: '200px' }}>
          <span className='font-14' style={{ color: '#344054' }}>
            Week {currentWeek} | {weekInfo.start} - {weekInfo.end}
          </span>
        </div>

        <button
          className='border-0'
          style={{
            background: 'transparent',
            cursor: isNextButtonDisabled() ? 'not-allowed' : 'pointer',
            opacity: isNextButtonDisabled() ? 0.5 : 1
          }}
          onClick={goToNextWeek}
          disabled={isNextButtonDisabled()}
          aria-disabled={isNextButtonDisabled()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.64645 1.80514C3.84171 1.60988 4.15829 1.60988 4.35355 1.80514L10.3536 7.80514C10.5488 8.0004 10.5488 8.31698 10.3536 8.51224L4.35355 14.5122C4.15829 14.7075 3.84171 14.7075 3.64645 14.5122C3.45118 14.317 3.45118 14.0004 3.64645 13.8051L9.29289 8.15869L3.64645 2.51224C3.45118 2.31698 3.45118 2.0004 3.64645 1.80514Z" fill="#344054" />
            <path fillRule="evenodd" clipRule="evenodd" d="M7.64645 1.80514C7.84171 1.60988 8.15829 1.60988 8.35355 1.80514L14.3536 7.80514C14.5488 8.0004 14.5488 8.31698 14.3536 8.51224L8.35355 14.5122C8.15829 14.7075 7.84171 14.7075 7.64645 14.5122C7.45118 14.317 7.45118 14.0004 7.64645 13.8051L13.2929 8.15869L7.64645 2.51224C7.45118 2.31698 7.45118 2.0004 7.64645 1.80514Z" fill="#344054" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WeekNavigator;
