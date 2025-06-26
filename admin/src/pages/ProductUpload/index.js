import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import React, { useState, useEffect, useRef } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegImages } from "react-icons/fa6";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";
import { API_ENDPOINTS } from "../../config";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useSearchParams } from 'react-router-dom';

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

// Color picker component
const ColorPicker = ({ onColorSelect }) => {
    const predefinedColors = [
        '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00', '#9ACD32', 
        '#32CD32', '#00FF00', '#00FFFF', '#00BFFF', '#0000FF', '#8A2BE2', 
        '#FF00FF', '#FF1493', '#FF69B4', '#FFB6C1', '#000000', '#808080', 
        '#FFFFFF', '#8B4513', '#A0522D', '#CD853F', '#F5DEB3', '#DEB887'
    ];

    const [selectedColor, setSelectedColor] = useState('');
    const [customColor, setCustomColor] = useState('');

    const handleColorClick = (color) => {
        setSelectedColor(color);
        onColorSelect(color);
    };

    const handleCustomColorChange = (e) => {
        const color = e.target.value;
        setCustomColor(color);
        if (color) {
            onColorSelect(color);
        }
    };

    return (
        <div className="color-picker">
            <div className="mb-2">
                <small className="text-muted">Predefined Colors:</small>
            </div>
            <div className="d-flex flex-wrap gap-1 mb-3">
                {predefinedColors.map((color, index) => (
                    <div
                        key={index}
                        className="color-swatch"
                        style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: color,
                            border: selectedColor === color ? '3px solid #007bff' : '2px solid #ddd',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'inline-block',
                            margin: '2px'
                        }}
                        onClick={() => handleColorClick(color)}
                        title={color}
                    />
                ))}
            </div>
            <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Custom Color:</small>
                <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    style={{ width: '40px', height: '30px', border: 'none', cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

const ProductUpload = () => {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('id');
    const isEditMode = !!productId;
    
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        basePrice: '',
        rating: 1,
        isFeatured: false,
        hasVariants: false
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Variant management
    const [variants, setVariants] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [newSize, setNewSize] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Predefined size options
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXL+'];

    // Fetch categories and product data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await fetch(API_ENDPOINTS.CATEGORIES);
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    setCategories(categoriesData);
                }

                // Fetch product data if in edit mode
                if (isEditMode && productId) {
                    setInitialLoading(true);
                    const productResponse = await fetch(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
                    if (productResponse.ok) {
                        const productData = await productResponse.json();
                        
                        // Populate form data
                        setFormData({
                            name: productData.name || '',
                            description: productData.description || '',
                            category: productData.category?._id || productData.category || '',
                            basePrice: productData.basePrice || productData.price || '',
                            rating: productData.rating || 1,
                            isFeatured: productData.isFeatured || false,
                            hasVariants: productData.hasVariants || false
                        });

                        // Set existing images
                        if (productData.image && Array.isArray(productData.image)) {
                            setExistingImages(productData.image);
                        }

                        // Set available colors and sizes
                        if (productData.availableColors) {
                            setAvailableColors(productData.availableColors);
                        }
                        if (productData.availableSizes) {
                            setAvailableSizes(productData.availableSizes);
                        }

                        // Set variants if they exist
                        if (productData.variants && Array.isArray(productData.variants)) {
                            setVariants(productData.variants);
                        }
                    } else {
                        setError('Failed to fetch product data');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [isEditMode, productId]);

    // Ensure image upload is properly set up
    useEffect(() => {
        const uploadButton = document.getElementById('image-upload');
        if (uploadButton) {
            console.log('Image upload input found:', uploadButton);
        } else {
            console.log('Image upload input not found');
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (event) => {
        setFormData(prev => ({
            ...prev,
            category: event.target.value
        }));
    };

    const handleRatingChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            rating: newValue
        }));
    };

    const handleImageChange = (e) => {
        console.log('Image change event triggered:', e.target.files);
        const files = Array.from(e.target.files);
        console.log('Selected files:', files);
        setSelectedImages(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        console.log('Preview URLs created:', previews);
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };

    const removeExistingImage = (index) => {
        const newExistingImages = existingImages.filter((_, i) => i !== index);
        setExistingImages(newExistingImages);
    };

    const handleImageUploadClick = () => {
        console.log('Image upload clicked');
        if (fileInputRef.current) {
            console.log('Triggering file input click via ref');
            fileInputRef.current.click();
        } else {
            console.log('File input ref not available, trying getElementById');
            const fileInput = document.getElementById('image-upload');
            if (fileInput) {
                fileInput.click();
            } else {
                console.log('File input not found');
            }
        }
    };

    // Convert image files to base64
    const convertImagesToBase64 = async (files) => {
        const base64Promises = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // Get the base64 string (remove the data:image/...;base64, prefix)
                    const base64String = reader.result;
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        try {
            const base64Images = await Promise.all(base64Promises);
            console.log('Images converted to base64:', base64Images.length);
            return base64Images;
        } catch (error) {
            console.error('Error converting images to base64:', error);
            throw new Error('Failed to convert images to base64');
        }
    };

    // Variant management functions
    const handleColorSelect = (color) => {
        setNewColor(color);
        setShowColorPicker(false);
    };

    const addColor = () => {
        if (newColor.trim() && !availableColors.includes(newColor.trim())) {
            setAvailableColors(prev => [...prev, newColor.trim()]);
            setNewColor('');
        }
    };

    const removeColor = (color) => {
        setAvailableColors(prev => prev.filter(c => c !== color));
        // Remove variants with this color
        setVariants(prev => prev.filter(v => v.color !== color));
    };

    const addSize = () => {
        if (newSize.trim() && !availableSizes.includes(newSize.trim())) {
            setAvailableSizes(prev => [...prev, newSize.trim()]);
            setNewSize('');
        }
    };

    const removeSize = (size) => {
        setAvailableSizes(prev => prev.filter(s => s !== size));
        // Remove variants with this size
        setVariants(prev => prev.filter(v => v.size !== size));
    };

    const generateVariants = () => {
        if (availableColors.length === 0 || availableSizes.length === 0) {
            setError('Please add at least one color and one size');
            return;
        }

        const newVariants = [];
        availableColors.forEach(color => {
            availableSizes.forEach(size => {
                newVariants.push({
                    color,
                    size,
                    price: parseFloat(formData.basePrice) || 0,
                    stock: 10
                });
            });
        });
        setVariants(newVariants);
    };

    const updateVariant = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: value
        };
        setVariants(updatedVariants);
    };

    const removeVariant = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImagesToCloudinary = async (images) => {
        const uploadedUrls = [];
        
        for (const image of images) {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', 'your_cloudinary_preset'); // You'll need to set this
            
            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const data = await response.json();
                    uploadedUrls.push(data.secure_url);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                throw new Error('Failed to upload images');
            }
        }
        
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name || !formData.description || !formData.category || !formData.basePrice) {
            setError('Please fill in all required fields');
            return;
        }

        if (selectedImages.length === 0 && existingImages.length === 0) {
            setError('Please select at least one image');
            return;
        }

        if (formData.hasVariants && variants.length === 0) {
            setError('Please generate variants for the product');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let imagesToSend = [];
            
            // Convert new images to base64
            if (selectedImages.length > 0) {
                const base64Images = await convertImagesToBase64(selectedImages);
                imagesToSend = [...existingImages, ...base64Images];
            } else {
                imagesToSend = existingImages;
            }

            // Create product data
            const productData = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                basePrice: parseFloat(formData.basePrice),
                rating: formData.rating,
                isFeatured: formData.isFeatured,
                hasVariants: formData.hasVariants,
                availableColors: availableColors,
                availableSizes: availableSizes,
                images: imagesToSend,
                variants: formData.hasVariants ? variants : []
            };

            console.log('Sending product data:', productData);

            // Submit to API
            const endpoint = isEditMode ? `${API_ENDPOINTS.PRODUCTS}/${productId}` : `${API_ENDPOINTS.PRODUCTS}/create`;
            const method = isEditMode ? 'PUT' : 'POST';
            
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error('Failed to save product');
            }

            const result = await response.json();
            console.log('Product saved:', result);
            
            setSuccess(true);
            
            if (!isEditMode) {
                // Reset form for new product
                setFormData({
                    name: '',
                    description: '',
                    category: '',
                    basePrice: '',
                    rating: 1,
                    isFeatured: false,
                    hasVariants: false
                });
                setSelectedImages([]);
                setImagePreviews([]);
                setVariants([]);
                setAvailableColors([]);
                setAvailableSizes([]);
                setExistingImages([]);
            }

            // Redirect to products page after 2 seconds
            setTimeout(() => {
                window.location.href = '/products';
            }, 2000);

        } catch (error) {
            console.error('Error saving product:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">{isEditMode ? 'Edit Product' : 'Product Upload'}</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small" />}
                        />
                        <StyledBreadcrumb
                            label="Products"
                            component="a"
                            href="#"
                        />
                        <StyledBreadcrumb
                            label={isEditMode ? 'Edit Product' : 'Product Upload'}
                        />
                    </Breadcrumbs>
                </div>

                {error && (
                    <div className="alert alert-danger m-4" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success m-4" role="alert">
                        Product {isEditMode ? 'updated' : 'created'} successfully! Redirecting to products page...
                    </div>
                )}

                <form className="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="card p-4">
                                <h5 className="mb-4">
                                    Basic Information
                                </h5>
                                <div className="form-group">
                                    <h6>PRODUCT NAME *</h6>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <h6>DESCRIPTION *</h6>
                                    <textarea 
                                        rows="5" 
                                        cols="10"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>CATEGORY *</h6>
                                            <FormControl className="w-100" required>
                                                <Select
                                                    value={formData.category}
                                                    onChange={handleCategoryChange}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Category</em>
                                                    </MenuItem>
                                                    {categories.map((category) => (
                                                        <MenuItem key={category._id} value={category._id} className="text-capitalize">
                                                            {category.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>BASE PRICE *</h6>
                                            <input 
                                                type="number" 
                                                name="basePrice" 
                                                className="w-100 form-control"
                                                value={formData.basePrice}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>RATINGS</h6>
                                            <Rating
                                                name="rating"
                                                value={formData.rating}
                                                onChange={handleRatingChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>FEATURED</h6>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={formData.isFeatured}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                                        name="isFeatured"
                                                        color="primary"
                                                    />
                                                }
                                                label="Mark as featured product"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT VARIANTS</h6>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={formData.hasVariants}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, hasVariants: e.target.checked }))}
                                                        name="hasVariants"
                                                        color="primary"
                                                    />
                                                }
                                                label="This product has variants (color/size)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Variant Management Section */}
                            {formData.hasVariants && (
                                <div className="card p-4 mt-3">
                                    <h5 className="mb-4">Product Variants</h5>
                                    
                                    {/* Color Management */}
                                    <div className="form-group mb-4">
                                        <h6>AVAILABLE COLORS</h6>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <TextField
                                                size="small"
                                                value={newColor}
                                                onChange={(e) => setNewColor(e.target.value)}
                                                placeholder="Color name or hex code"
                                                style={{ width: '200px' , padding: '0px' }}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                            />
                                            <IconButton
                                                color="primary"
                                                onClick={() => setShowColorPicker(!showColorPicker)}
                                                style={{ minWidth: 'auto', padding: '8px 12px' }}
                                            >
                                                <ColorLensIcon />
                                            
                                            </IconButton>
                                            <IconButton 
                                                onClick={addColor} 
                                                color="primary"
                                                size="small"
                                                disabled={!newColor.trim()}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        
                                        {showColorPicker && (
                                            <div className="mb-3 p-3 border rounded">
                                                <ColorPicker onColorSelect={handleColorSelect} />
                                            </div>
                                        )}
                                        
                                        <div className="d-flex flex-wrap gap-2">
                                            {availableColors.map((color, index) => (
                                                <Chip
                                                    key={index}
                                                    label={
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="me-1"
                                                                style={{
                                                                    width: '12px',
                                                                    height: '12px',
                                                                    backgroundColor: color.startsWith('#') ? color : '#ddd',
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '2px'
                                                                }}
                                                            />
                                                            {color}
                                                        </div>
                                                    }
                                                    onDelete={() => removeColor(color)}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Management */}
                                    <div className="form-group mb-4">
                                        <h6>AVAILABLE SIZES</h6>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <FormControl size="large" style={{ width: '200px' }}>
                                                <Select
                                                    value={newSize}
                                                    onChange={(e) => setNewSize(e.target.value)}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select size</em>
                                                    </MenuItem>
                                                    {sizeOptions.map((size) => (
                                                        <MenuItem key={size} value={size}>
                                                            {size}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                size="small"
                                                value={newSize}
                                                onChange={(e) => setNewSize(e.target.value)}
                                                placeholder="Custom size"
                                                style={{ width: '150px' , padding: '0px' }}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                                            />
                                            <IconButton 
                                                onClick={addSize} 
                                                color="primary"
                                                size="small"
                                                disabled={!newSize.trim()}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            {availableSizes.map((size, index) => (
                                                <Chip
                                                    key={index}
                                                    label={size}
                                                    onDelete={() => removeSize(size)}
                                                    color="secondary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Generate Variants Button */}
                                    {availableColors.length > 0 && availableSizes.length > 0 && (
                                        <div className="form-group mb-4">
                                            <Button
                                                variant="outlined"
                                                onClick={generateVariants}
                                                className="mb-3"
                                                size="small"
                                            >
                                                Generate Variants ({availableColors.length} × {availableSizes.length} = {availableColors.length * availableSizes.length})
                                            </Button>
                                        </div>
                                    )}

                                    {/* Variants Table */}
                                    {variants.length > 0 && (
                                        <div className="form-group">
                                            <h6>PRODUCT VARIANTS ({variants.length})</h6>
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-sm">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th style={{ width: '20%' }}>Color</th>
                                                            <th style={{ width: '15%' }}>Size</th>
                                                            <th style={{ width: '25%' }}>Price</th>
                                                            <th style={{ width: '25%' }}>Stock</th>
                                                            <th style={{ width: '15%' }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {variants.map((variant, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div
                                                                            className="me-2"
                                                                            style={{
                                                                                width: '16px',
                                                                                height: '16px',
                                                                                backgroundColor: variant.color.startsWith('#') ? variant.color : '#ddd',
                                                                                border: '1px solid #ccc',
                                                                                borderRadius: '50%'
                                                                            }}
                                                                        />
                                                                        {variant.color}
                                                                    </div>
                                                                </td>
                                                                <td>{variant.size}</td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        value={variant.price}
                                                                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                                                        className="form-control form-control-sm"
                                                                        step="0.01"
                                                                        min="0"
                                                                        style={{ width: '80px' }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        value={variant.stock}
                                                                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                                                                        className="form-control form-control-sm"
                                                                        min="0"
                                                                        style={{ width: '60px' }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <IconButton
                                                                        onClick={() => removeVariant(index)}
                                                                        color="error"
                                                                        size="small"
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card p-4 mt-0">
                        <div className="imagesUploadSec">
                            <h5 className="mb-4">Media And Published</h5>

                            <div className="imgUploadBox d-flex align-items-center flex-wrap">
                                {/* Existing Images */}
                                {existingImages.map((image, index) => (
                                    <div key={`existing-${index}`} className="uploadBox me-3 mb-3">
                                        <span
                                            className="remove"
                                            onClick={() => removeExistingImage(index)}
                                        >
                                            <IoCloseSharp />
                                        </span>
                                        <div className="box">
                                            <LazyLoadImage
                                                alt={`Existing Image ${index + 1}`}
                                                effect="blur"
                                                className="w-100"
                                                src={image}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Image Previews */}
                                {imagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="uploadBox me-3 mb-3">
                                        <span
                                            className="remove"
                                            onClick={() => removeImage(index)}
                                        >
                                            <IoCloseSharp />
                                        </span>
                                        <div className="box">
                                            <LazyLoadImage
                                                alt={`Preview ${index + 1}`}
                                                effect="blur"
                                                className="w-100"
                                                src={preview}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                <div className="uploadBox">
                                    <input
                                        type="file"
                                        multiple
                                        name="images"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="d-none"
                                        id="image-upload"
                                        ref={fileInputRef}
                                    />
                                    <button 
                                        type="button"
                                        className="info"
                                        onClick={handleImageUploadClick}
                                        onMouseDown={() => console.log('Mouse down on upload area')}
                                        onMouseUp={() => console.log('Mouse up on upload area')}
                                        style={{ 
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            pointerEvents: 'auto',
                                            border: 'none',
                                            background: 'none',
                                            width: '100%',
                                            height: '100%',
                                            padding: '0'
                                        }}
                                    >
                                        <FaRegImages />
                                        <h5>Upload Images</h5>
                                        <small className="text-muted">Click to select images</small>
                                    </button>
                                </div>
                            </div>

                            <br />

                            <Button 
                                type="submit"
                                className="btn-blue btn-lg btn-big"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        {isEditMode ? 'Updating Product...' : 'Creating Product...'}
                                    </>
                                ) : (
                                    <>
                                        <FaCloudUploadAlt /> &nbsp; {isEditMode ? 'UPDATE PRODUCT' : 'PUBLISH AND VIEW'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductUpload;