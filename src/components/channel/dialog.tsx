import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import useAuth from '@/hooks/useAuth';

interface ChannelData {
  _id?: string;
  name?: string;
  description?: string;
}

interface ChannelDialogueProps {
  isopen: boolean;
  onclose: () => void;
  channeldata?: ChannelData;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  description: string;
}

const ChannelDialogue: React.FC<ChannelDialogueProps> = ({
  isopen,
  onclose,
  channeldata,
  mode,
}) => {
  const { loading, user, createOrUpdate } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlesubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const channel = await createOrUpdate(formData);
    router.push(`/channel/${channel._id}`);
    onclose();
  };

  useEffect(() => {
    if (channeldata && mode === 'edit') {
      setFormData({
        name: channeldata.name || '',
        description: channeldata.description || '',
      });
    } else {
      setFormData({
        name: user?.name || formData.name,
        description: formData.description || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channeldata, user]);

  return (
    <Dialog open={isopen} onOpenChange={onclose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create your channel' : 'Edit your channel'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill out the form below to create your channel.'
              : 'Update your channel information below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlesubmit} className="space-y-6">
          {/* Channel Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Channel Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Channel Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell viewers about your channel..."
            />
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={onclose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? 'Saving...'
                : mode === 'create'
                ? 'Create Channel'
                : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDialogue;