const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST: Submit a new contact message
router.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and message are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Create new contact message
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim()
        });

        const savedContact = await contact.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.',
            data: {
                id: savedContact._id,
                name: savedContact.name,
                email: savedContact.email,
                createdAt: savedContact.createdAt
            }
        });

    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// GET: Get all contact messages (for admin)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 }) // Most recent first
            .select('-__v');

        res.status(200).json({
            success: true,
            data: contacts
        });

    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact messages'
        });
    }
});

// GET: Get a specific contact message by ID (for admin)
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).select('-__v');
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Error fetching contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact message'
        });
    }
});

// PUT: Update contact message status (for admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required (unread, read, or replied)'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select('-__v');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: contact
        });

    } catch (error) {
        console.error('Error updating contact message status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
});

// DELETE: Delete a contact message (for admin)
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact message'
        });
    }
});

// GET: Get contact statistics (for admin dashboard)
router.get('/stats/summary', async (req, res) => {
    try {
        const totalMessages = await Contact.countDocuments();
        const unreadMessages = await Contact.countDocuments({ status: 'unread' });
        const readMessages = await Contact.countDocuments({ status: 'read' });
        const repliedMessages = await Contact.countDocuments({ status: 'replied' });

        // Get recent messages (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentMessages = await Contact.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            success: true,
            data: {
                total: totalMessages,
                unread: unreadMessages,
                read: readMessages,
                replied: repliedMessages,
                recent: recentMessages
            }
        });

    } catch (error) {
        console.error('Error fetching contact statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact statistics'
        });
    }
});

module.exports = router; 