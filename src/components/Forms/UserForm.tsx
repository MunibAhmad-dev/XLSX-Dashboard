import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserRecord } from '../../types';
import { Save, X } from 'lucide-react';

interface UserFormProps {
  initialData?: Partial<UserRecord>;
  onSubmit: (data: Omit<UserRecord, 'id' | 'dateAdded'>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save Record'
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    number: initialData.number || '',
    email: initialData.email || '',
    cnic: initialData.cnic || '',
    hardCopyGiven: initialData.hardCopyGiven || false,
    notes: initialData.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const quillRef = useRef<ReactQuill>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.number.trim()) newErrors.number = 'Number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.cnic.trim()) newErrors.cnic = 'CNIC is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number *
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CNIC *
          </label>
          <input
            type="text"
            value={formData.cnic}
            onChange={(e) => handleInputChange('cnic', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.cnic ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter CNIC number"
          />
          {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="hardCopyGiven"
          checked={formData.hardCopyGiven}
          onChange={(e) => handleInputChange('hardCopyGiven', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="hardCopyGiven" className="ml-2 block text-sm text-gray-700">
          Hard copy documents received
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <div className="bg-white rounded-lg border border-gray-300">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={formData.notes}
            onChange={(value) => handleInputChange('notes', value)}
            modules={quillModules}
            placeholder="Add any additional notes..."
            style={{ minHeight: '120px' }}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;