import React, { useEffect, useState } from 'react';
import { Building, ChevronDown, ChevronLeft, Envelope, InfoSquare, Person, Upload } from 'react-bootstrap-icons';
import { NavLink, useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { Col, Row, Button } from 'react-bootstrap';

const schema = yup.object({
  name: yup.string().required('Company name is required'),
  category: yup.number().typeError("Enter a valid category").required('Category is required'),
  abn: yup.string().required('ABN is required'),
  phone: yup.string({
    country: yup.string().required("Country is required"),
    number: yup.string().required("Phone number is required")
  }),
  email: yup.string().email('Invalid email').required('Email is required'),
  website: yup.string().url('Invalid URL').required('URL is required'),

  addresses: yup.array().of(
    yup.object({
      country: yup.string().required('Country is required'),
      address: yup.string().required('Address is required'),
      city: yup.number().typeError("City must be a number").required("City is required"),
      state: yup.number().typeError("State must be a number").required("State is required"),
      postcode: yup.string().required('Postcode is required'),
      is_main: yup.boolean().default(false).required('Main address selection is required'),
    })
  ).required(),

  contact_persons: yup.array().of(
    yup.object({
      firstname: yup.string().required('First name is required'),
      lastname: yup.string().required('Last name is required'),
      phone: yup.string({
        country: yup.string().required("Country is required"),
        number: yup.string().required("Phone number is required")
      }),
      email: yup.string().email('Invalid email').required('Email is required'),
      position: yup.string().required('Position is required'),
      is_main: yup.boolean().default(false).required('Main contact selection is required'),
    })
  ).required(),

  industry: yup.number().typeError("Enter a valid industry").required('Industry is required'),
  payment_terms: yup.number().typeError("Enter a valid payment terms").required('Payment terms are required'),

}).required();

const BusinessClientEdit = () => {
  return (
    <div>BusinessClientEdit</div>
  )
}

export default BusinessClientEdit